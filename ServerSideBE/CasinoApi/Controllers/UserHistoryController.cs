using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CasinoApi.Models;
using CasinoApi.Data;

namespace CasinoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserHistoryController : ControllerBase
    {
        private readonly CasinoDbContext _context;

        public UserHistoryController(CasinoDbContext context)
        {
            _context = context;
        }

        // Get all user history records
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserHistory>>> GetUserHistory()
        {
            return await _context.UserHistory.ToListAsync();
        }

        // Get a specific user history record by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<UserHistory>> GetUserHistoryItem(int id)
        {
            var historyItem = await _context.UserHistory.FindAsync(id);
            if (historyItem == null) return NotFound();
            return historyItem;
        }

        // Get the last 10 user history records for a specific user, including related game and transaction info
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserHistoryDto>>> GetUserHistoryByUser(int userId)
        {
            var history = await _context.UserHistory
                .Where(h => h.UserID == userId)
                .Include(h => h.GameTransaction)
                    .ThenInclude(gt => gt.Game)
                .OrderByDescending(h => h.GameTransaction.Date)
                .Take(10)
                .Select(h => new UserHistoryDto
                {
                    StatisticID = h.StatisticID,
                    UserID = h.UserID,
                    GameTransactionID = h.GameTransactionID,
                    GameTransaction = h.GameTransaction == null ? null : new GameTransactionDto
                    {
                        Amount = h.GameTransaction.CashAmount,
                        IsWin = h.GameTransaction.GameResult > 0,
                        Timestamp = h.GameTransaction.Date,
                        Game = h.GameTransaction.Game == null ? null : new GameDto
                        {
                            Name = h.GameTransaction.Game.GameName
                        },
                        GameResult = h.GameTransaction.GameResult
                    }
                })
                .ToListAsync();

            return history;
        }

        // Create a new user history record
        [HttpPost]
        public async Task<ActionResult<UserHistory>> CreateUserHistoryItem(UserHistory historyItem)
        {
            _context.UserHistory.Add(historyItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserHistoryItem), new { id = historyItem.StatisticID }, historyItem);
        }

        // Update an existing user history record
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserHistoryItem(int id, UserHistory historyItem)
        {
            if (id != historyItem.StatisticID) return BadRequest();

            _context.Entry(historyItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await UserHistoryItemExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // Delete a user history record by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserHistoryItem(int id)
        {
            var historyItem = await _context.UserHistory.FindAsync(id);
            if (historyItem == null) return NotFound();

            _context.UserHistory.Remove(historyItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if a user history record exists by ID
        private async Task<bool> UserHistoryItemExists(int id)
        {
            return await _context.UserHistory.AnyAsync(e => e.StatisticID == id);
        }
    }
}