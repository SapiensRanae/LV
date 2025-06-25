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

        [HttpPost("spin")]
        public async Task<IActionResult> Spin(SpinRequest request)
        {
            // Get user from database
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Validate bet amount
            if (request.BetAmount <= 0)
                return BadRequest(new { message = "Bet amount must be greater than zero" });

            if (user.Balance < request.BetAmount)
                return BadRequest(new { message = "Insufficient balance" });

            // Generate random outcome (0-36, plus 00 represented as 37)
            int outcome = _random.Next(38); // 0-37
            string outcomeColor = GetRouletteColor(outcome);

            // Calculate winnings
            decimal winnings = CalculateWinnings(request, outcome, outcomeColor);

            // Record previous balance before update
            decimal previousBalance = user.Balance;
            
// Update user balance
            user.Balance -= request.BetAmount; // Deduct bet
            user.Balance += winnings; // Add winnings if any

// Create financial transaction
            var financialTransaction = new FinancialTransaction
            {
                UserID = request.UserId,
                CashAmount = winnings - request.BetAmount, // Net change
                TransactionType = "Roulette",
                Date = DateTime.Now,
                PreviousBalance = previousBalance,
                NewBalance = user.Balance
            };

            _context.FinancialTransactions.Add(financialTransaction);

// Create game transaction
            var gameTransaction = new GameTransaction
            {
                UserID = request.UserId,
                GameID = 1, // Get the correct GameID for Roulette
                CashAmount = request.BetAmount,
                Date = DateTime.Now,
                TransactionType = "Roulette",
                PreviousBalance = previousBalance,
                NewBalance = user.Balance,
                GameResult = winnings
            };

            _context.GameTransactions.Add(gameTransaction);
            await _context.SaveChangesAsync();

// Create user history record
            var userHistory = new UserHistory
            {
                UserID = request.UserId,
                GameTransactionID = gameTransaction.GameTransactionID
            };

            _context.UserHistory.Add(userHistory);
            await _context.SaveChangesAsync();

            return Ok(new {
                outcome = outcome == 37 ? "00" : outcome.ToString(),
                color = outcomeColor,
                betAmount = request.BetAmount,
                winnings = winnings,
                newBalance = user.Balance
            });
        }

        private string GetRouletteColor(int number)
        {
            if (number == 0 || number == 37) // 0 or 00
                return "green";

            // Red numbers: 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
            int[] redNumbers = { 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 };

            return Array.IndexOf(redNumbers, number) != -1 ? "red" : "black";
        }

        private decimal CalculateWinnings(SpinRequest bet, int outcome, string outcomeColor)
        {
            string outcomeStr = outcome == 37 ? "00" : outcome.ToString();
            int outcomeNumber = outcome == 37 ? 0 : outcome;

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