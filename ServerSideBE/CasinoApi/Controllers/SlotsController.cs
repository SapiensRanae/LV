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
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SlotsController : ControllerBase
    {
        private readonly CasinoDbContext _context;
        private static readonly string[] Suits = { "hearts", "diamonds", "clubs", "spades" };
        private static readonly string[] Colors = { "black", "white" };
        private static readonly string LuckyVegas = "LV";
        private const int SlotsGameId = 8;

        public SlotsController(CasinoDbContext context)
        {
            _context = context;
        }

        [HttpPost("spin")]
        public async Task<IActionResult> Spin([FromBody] SlotSpinRequest request)
        {
            if (request.BetAmount < 5)
                return BadRequest(new { message = "Minimal stake is 5 coins." });

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.Balance < request.BetAmount)
                return UnprocessableEntity(new { message = "Insufficient balance." });

            // Simulate 4 reels
            var reels = new List<Card>();
            var rand = new Random();
            for (int i = 0; i < 4; i++)
            {
                if (rand.Next(12) == 0)
                    reels.Add(new Card { Name = LuckyVegas, Color = "special", Suit = "special" });
                else
                {
                    var color = Colors[rand.Next(Colors.Length)];
                    var suit = Suits[rand.Next(Suits.Length)];
                    reels.Add(new Card { Name = $"{color}_{suit}", Color = color, Suit = suit });
                }
            }

            var (combination, multiplier) = EvaluateCombination(reels);
            var winnings = request.BetAmount * multiplier;
            var previousBalance = user.Balance;

            // Update user balance
            user.Balance -= request.BetAmount;
            user.Balance += winnings;
            await _context.SaveChangesAsync();

            // Add financial transaction
            var netChange = winnings - request.BetAmount;
            var financialTransactionType = netChange >= 0 ? "deposit" : "withdrawal";
            var financialTransaction = new FinancialTransaction
            {
                UserID = user.UserID,
                CashAmount = netChange,
                TransactionType = financialTransactionType,
                Date = DateTime.Now,
                PreviousBalance = previousBalance,
                NewBalance = user.Balance
            };
            _context.FinancialTransactions.Add(financialTransaction);

            // Add game transaction
            var gameTransaction = new GameTransaction
            {
                UserID = user.UserID,
                GameID = SlotsGameId,
                CashAmount = request.BetAmount,
                Date = DateTime.Now,
                TransactionType = winnings > 0 ? "win" : "bet",
                PreviousBalance = previousBalance,
                NewBalance = user.Balance,
                GameResult = winnings
            };
            _context.GameTransactions.Add(gameTransaction);
            await _context.SaveChangesAsync();

            // Add user history
            var userHistory = new UserHistory
            {
                UserID = user.UserID,
                GameTransactionID = gameTransaction.GameTransactionID
            };
            _context.UserHistory.Add(userHistory);
            await _context.SaveChangesAsync();

            return Ok(new SlotSpinResult
            {
                Reels = reels,
                Combination = combination,
                Multiplier = multiplier,
                BetAmount = request.BetAmount,
                Winnings = winnings
            });
        }

        private (string combination, int multiplier) EvaluateCombination(List<Card> reels)
        {
            if (reels.All(c => c.Name == LuckyVegas))
                return ("Legendary", 1000);
            if (reels.All(c => c.Color == "black") && reels.Select(c => c.Suit).Distinct().Count() == 4)
                return ("Grand", 500);
            if (reels.All(c => c.Color == "white") && reels.Select(c => c.Suit).Distinct().Count() == 4)
                return ("Epic", 250);
            if (reels.All(c => c.Color == "black") && reels.Select(c => c.Suit).Distinct().Count() == 1)
                return ("Major", 100);
            if (reels.All(c => c.Color == "white") && reels.Select(c => c.Suit).Distinct().Count() == 1)
                return ("Advanced", 50);
            if (reels.Select(c => c.Suit).Distinct().Count() == 1)
                return ("Minor", 20);

            var subsets = new[] { reels.Take(3), reels.Skip(1).Take(3) };
            foreach (var subset in subsets)
            {
                var cards = subset.ToList();
                if (cards.All(c => c.Name == LuckyVegas))
                    return ("Epic (3 LV)", 250);
                if (cards.All(c => c.Color == "black") && cards.Select(c => c.Suit).Distinct().Count() == 1)
                    return ("Major (3 black same suit)", 100);
                if (cards.All(c => c.Color == "white") && cards.Select(c => c.Suit).Distinct().Count() == 1)
                    return ("Advanced (3 white same suit)", 50);
                if (cards.Select(c => c.Suit).Distinct().Count() == 1)
                    return ("Mini", 10);
            }
            return ("No Win", 0);
        }
    }

    public class SlotSpinRequest
    {
        public int UserId { get; set; }
        public int BetAmount { get; set; }
    }

    public class Card
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public string Suit { get; set; }
    }

    public class SlotSpinResult
    {
        public List<Card> Reels { get; set; }
        public string Combination { get; set; }
        public int Multiplier { get; set; }
        public int BetAmount { get; set; }
        public int Winnings { get; set; }
    }
}