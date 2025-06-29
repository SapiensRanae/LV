using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CasinoApi.Data;
using CasinoApi.Models;

namespace CasinoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BlackjackController : ControllerBase
    {
        private readonly CasinoDbContext _context;
        private readonly Random _random;

        public BlackjackController(CasinoDbContext context)
        {
            _context = context;
            _random = new Random();
        }

        // DTOs
        public class CreateLobbyRequest
        {
            public bool IsPrivate { get; set; }
        }

        public class JoinLobbyRequest
        {
            public string LobbyCode { get; set; } = string.Empty;
        }




        // In-memory storage for lobbies (replace with a database table if needed)
        private static readonly Dictionary<string, Lobby> Lobbies = new();

        public class Lobby
        {
            public string Code { get; set; } = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
            public bool IsPrivate { get; set; }
            public List<int> PlayerIds { get; set; } = new();
            public bool IsGameStarted { get; set; } = false;
        }

        // Create a new lobby
        [HttpPost("create-lobby")]
        public IActionResult CreateLobby([FromBody] CreateLobbyRequest request)
        {
            var lobby = new Lobby
            {
                IsPrivate = request.IsPrivate
            };

            Lobbies[lobby.Code] = lobby;

            return Ok(new { lobbyCode = lobby.Code });
        }
        public class PlayerHistoryItem
        {
            public int GameTransactionID { get; set; }
            public decimal CashAmount { get; set; }
            public DateTime Date { get; set; }
            public string TransactionType { get; set; } = string.Empty;
        }

        public class PlayerProfileResponse
        {
            public string Username { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? UserIcon { get; set; }
            public List<PlayerHistoryItem> History { get; set; } = new();
        }

        // Join an existing lobby
        [HttpPost("join-lobby")]
        public async Task<IActionResult> JoinLobby([FromBody] JoinLobbyRequest request)
        {
            if (!Lobbies.TryGetValue(request.LobbyCode, out var lobby))
                return NotFound(new { message = "Lobby not found" });

            if (lobby.PlayerIds.Count >= 3)
                return BadRequest(new { message = "Lobby is full" });

            var userId = int.Parse(User.Claims.First(c => c.Type == "sub").Value);
            if (lobby.PlayerIds.Contains(userId))
                return BadRequest(new { message = "You are already in this lobby" });

            lobby.PlayerIds.Add(userId);

            return Ok(new { message = "Joined lobby", lobbyCode = lobby.Code });
        }

        // Start a game in a lobby

       [HttpPost("start-game/{lobbyCode}")]
public async Task<IActionResult> StartGame(string lobbyCode)
{
    if (!Lobbies.TryGetValue(lobbyCode, out var lobby))
        return NotFound(new { message = "Lobby not found" });

    if (lobby.IsGameStarted)
        return BadRequest(new { message = "Game already started" });

    lobby.IsGameStarted = true;

    // Ensure the dealer is always a bot
    var botDealerId = -1; // -1 represents the bot dealer
    if (!lobby.PlayerIds.Contains(botDealerId))
    {
        lobby.PlayerIds.Add(botDealerId);
    }

    var activePlayers = new List<int>(lobby.PlayerIds.Where(id => id != botDealerId));
    decimal currentBet = 0;
    var foldedPlayers = new HashSet<int>();

    while (activePlayers.Count > 1)
    {
        foreach (var playerId in activePlayers.ToList())
        {
            if (foldedPlayers.Contains(playerId)) continue;

            var player = await _context.Users.FindAsync(playerId);
            if (player == null)
                return NotFound(new { message = $"Player with ID {playerId} not found" });

            // Simulate player action (replace with actual client interaction)
            var action = SimulatePlayerAction(playerId, currentBet);

            switch (action.ActionType)
            {
                case "fold":
                    foldedPlayers.Add(playerId);
                    activePlayers.Remove(playerId);
                    break;

                case "call":
                    if (player.Balance < currentBet)
                        return BadRequest(new { message = $"Player {player.Username} has insufficient balance to call" });

                    player.Balance -= currentBet;
                    LogTransaction(playerId, -currentBet, "call", player.Balance + currentBet, player.Balance);
                    break;

                case "raise":
                    if (player.Balance < action.Amount)
                        return BadRequest(new { message = $"Player {player.Username} has insufficient balance to raise" });

                    currentBet = action.Amount;
                    player.Balance -= currentBet;
                    LogTransaction(playerId, -currentBet, "raise", player.Balance + currentBet, player.Balance);
                    break;
            }
        }
    }

    await _context.SaveChangesAsync();

    return Ok(new { message = "Game started", players = activePlayers });
}

// Simulate player action (replace with actual client interaction)
private (string ActionType, decimal Amount) SimulatePlayerAction(int playerId, decimal currentBet)
{
    // Example: Replace this with actual logic to get player input
    return new Random().Next(0, 3) switch
    {
        0 => ("fold", 0),
        1 => ("call", currentBet),
        2 => ("raise", currentBet + 50),
        _ => ("call", currentBet)
    };
}

// Log financial transaction
private void LogTransaction(int userId, decimal amount, string type, decimal previousBalance, decimal newBalance)
{
    var financialTransaction = new FinancialTransaction
    {
        UserID = userId,
        CashAmount = amount,
        TransactionType = type,
        PreviousBalance = previousBalance,
        NewBalance = newBalance,
        Date = DateTime.Now
    };
    _context.FinancialTransactions.Add(financialTransaction);
}
        // View a player's profile
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetPlayerProfile(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var history = await _context.UserHistory
                .Where(h => h.UserID == userId)
                .Select(h => new PlayerHistoryItem
                {
                    GameTransactionID = h.GameTransactionID,
                    CashAmount = h.GameTransaction.CashAmount,
                    Date = h.GameTransaction.Date,
                    TransactionType = h.GameTransaction.TransactionType
                })
                .ToListAsync();

            return Ok(new PlayerProfileResponse
            {
                Username = user.Username,
                Description = user.Description,
                UserIcon = user.UserIcon != null ? "data:image/png;base64," + Convert.ToBase64String(user.UserIcon) : null,
                History = history
            });
        }

        // Leave a lobby
        [HttpPost("leave-lobby/{lobbyCode}")]
        public IActionResult LeaveLobby(string lobbyCode)
        {
            if (!Lobbies.TryGetValue(lobbyCode, out var lobby))
                return NotFound(new { message = "Lobby not found" });

            var userId = int.Parse(User.Claims.First(c => c.Type == "sub").Value);
            lobby.PlayerIds.Remove(userId);

            if (lobby.PlayerIds.Count == 0)
                Lobbies.Remove(lobbyCode); 

            return Ok(new { message = "Left lobby" });
        }
    }
}