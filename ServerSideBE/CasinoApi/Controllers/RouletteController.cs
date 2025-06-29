using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CasinoApi.Data;
using CasinoApi.Models;

namespace CasinoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RouletteController : ControllerBase
    {
        private readonly CasinoDbContext _context;
        private readonly Random _random;

        public RouletteController(CasinoDbContext context)
        {
            _context = context;
            _random = new Random();
        }

        // DTO for spin requests
        public class SpinRequest
        {
            public int UserId { get; set; }
            public decimal BetAmount { get; set; }
            public string BetType { get; set; } = string.Empty;
            public int? BetNumber { get; set; }
            public string? BetColor { get; set; }
            public string? ColumnType { get; set; }
            public string? DozenType { get; set; }
        }
        public class MultiSpinRequest
        {
            public int UserId { get; set; }
            public List<RouletteController.SpinRequest> Bets { get; set; } = new();
        }

        // Handles a roulette spin and processes the bet
        [HttpPost("spin")]
public async Task<IActionResult> Spin([FromBody] MultiSpinRequest request)
{
    try
    {
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        decimal totalBet = 0;
        foreach (var bet in request.Bets)
        {
            if (bet.BetAmount <= 0)
                return BadRequest(new { message = "Bet amount must be greater than zero" });
            totalBet += bet.BetAmount;
        }

        if (user.Balance < totalBet)
            return BadRequest(new { message = "Insufficient balance" });

        int outcome = _random.Next(38); // 0-37
        string outcomeColor = GetRouletteColor(outcome);

        decimal totalWinnings = 0;
        var betResults = new List<object>();
        foreach (var bet in request.Bets)
        {
            decimal winnings = CalculateWinnings(bet, outcome, outcomeColor);
            totalWinnings += winnings;
            betResults.Add(new
            {
                betType = bet.BetType,
                betNumber = bet.BetNumber,
                betColor = bet.BetColor,
                betAmount = bet.BetAmount,
                winnings
            });
        }

        decimal previousBalance = user.Balance;
        user.Balance -= totalBet;
        user.Balance += totalWinnings;
        await _context.SaveChangesAsync();

        var netChange = totalWinnings - totalBet;
        var financialTransactionType = netChange >= 0 ? "deposit" : "withdrawal";
        var financialTransaction = new FinancialTransaction
        {
            UserID = request.UserId,
            CashAmount = netChange,
            TransactionType = financialTransactionType,
            Date = DateTime.Now,
            PreviousBalance = previousBalance,
            NewBalance = user.Balance
        };
        _context.FinancialTransactions.Add(financialTransaction);

        var gameTransaction = new GameTransaction
        {
            UserID = request.UserId,
            GameID = 6,
            CashAmount = totalBet,
            Date = DateTime.Now,
            TransactionType = totalWinnings > 0 ? "win" : "bet",
            PreviousBalance = previousBalance,
            NewBalance = user.Balance,
            GameResult = totalWinnings
        };
        _context.GameTransactions.Add(gameTransaction);
        await _context.SaveChangesAsync();

        var userHistory = new UserHistory
        {
            UserID = request.UserId,
            GameTransactionID = gameTransaction.GameTransactionID
        };
        _context.UserHistory.Add(userHistory);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            outcome = outcome == 37 ? "00" : outcome.ToString(),
            color = outcomeColor,
            bets = betResults,
            totalBet,
            totalWinnings,
            newBalance = user.Balance
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in Roulette/Spin: {ex.Message}");
        return StatusCode(500, new { message = $"Error: {ex.Message}" });
    }
}

        // Returns the color for a given roulette number
        private string GetRouletteColor(int number)
        {
            if (number == 0 || number == 37) // 0 or 00
                return "green";

            int[] redNumbers = { 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 };
            return Array.IndexOf(redNumbers, number) != -1 ? "red" : "black";
        }

        // Calculates winnings based on bet and outcome
        private decimal CalculateWinnings(SpinRequest bet, int outcome, string outcomeColor)
        {
            string outcomeStr = outcome == 37 ? "00" : outcome.ToString();
            int outcomeNumber = outcome == 37 ? 0 : outcome;

            // If bet is over 3000, lower the chance to win
            if (bet.BetAmount > 3000)
            {
                if (_random.NextDouble() < 0.4)
                    return 0;
            }
            if (bet.BetAmount > 500000)
            {
                return 0; // No bets over 500000 allowed
            }

            switch (bet.BetType.ToLower())
            {
                case "single":
                    if (bet.BetNumber.HasValue &&
                        (outcomeStr == bet.BetNumber.ToString() ||
                         (outcomeStr == "00" && bet.BetNumber == 37)))
                        return bet.BetAmount * 36;
                    break;

                case "column":
                    if (outcomeNumber > 0)
                    {
                        int[] firstColumn = { 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36 };
                        int[] secondColumn = { 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35 };
                        int[] thirdColumn = { 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 };

                        bool isInFirstColumn = Array.IndexOf(firstColumn, outcomeNumber) != -1;
                        bool isInSecondColumn = Array.IndexOf(secondColumn, outcomeNumber) != -1;
                        bool isInThirdColumn = Array.IndexOf(thirdColumn, outcomeNumber) != -1;

                        if ((bet.ColumnType == "first" && isInFirstColumn) ||
                            (bet.ColumnType == "second" && isInSecondColumn) ||
                            (bet.ColumnType == "third" && isInThirdColumn))
                        {
                            return bet.BetAmount * 3;
                        }
                    }
                    break;

                case "dozen":
                    if (outcomeNumber > 0)
                    {
                        if ((bet.DozenType == "first" && outcomeNumber >= 1 && outcomeNumber <= 12) ||
                            (bet.DozenType == "second" && outcomeNumber >= 13 && outcomeNumber <= 24) ||
                            (bet.DozenType == "third" && outcomeNumber >= 25 && outcomeNumber <= 36))
                        {
                            return bet.BetAmount * 3;
                        }
                    }
                    break;

                case "even":
                    if (outcomeNumber > 0 && outcomeNumber % 2 == 0)
                        return bet.BetAmount * 2;
                    break;

                case "odd":
                    if (outcomeNumber > 0 && outcomeNumber % 2 == 1)
                        return bet.BetAmount * 2;
                    break;

                case "red":
                case "color" when bet.BetColor?.ToLower() == "red":
                    if (outcomeColor == "red")
                        return bet.BetAmount * 2;
                    break;

                case "black":
                case "color" when bet.BetColor?.ToLower() == "black":
                    if (outcomeColor == "black")
                        return bet.BetAmount * 2;
                    break;
            }

            return 0; // Loss
        }
    }
}