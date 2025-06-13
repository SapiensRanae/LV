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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserHistory>>> GetUserHistory()
        {
            return await _context.UserHistory.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserHistory>> GetUserHistoryItem(int id)
        {
            var historyItem = await _context.UserHistory.FindAsync(id);
            if (historyItem == null) return NotFound();
            return historyItem;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserHistory>>> GetUserHistoryByUser(int userId)
        {
            return await _context.UserHistory
                .Where(h => h.UserID == userId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UserHistory>> CreateUserHistoryItem(UserHistory historyItem)
        {
            _context.UserHistory.Add(historyItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserHistoryItem), new { id = historyItem.StatisticID }, historyItem);
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserHistoryItem(int id)
        {
            var historyItem = await _context.UserHistory.FindAsync(id);
            if (historyItem == null) return NotFound();

            _context.UserHistory.Remove(historyItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> UserHistoryItemExists(int id)
        {
            return await _context.UserHistory.AnyAsync(e => e.StatisticID == id);
        }
    }
}