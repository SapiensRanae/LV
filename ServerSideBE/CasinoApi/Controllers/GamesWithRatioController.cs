using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using CasinoApi.Models;
using CasinoApi.Data;   

namespace CasinoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesWithRatioController : ControllerBase
    {
        private readonly CasinoDbContext _context;

        public GamesWithRatioController(CasinoDbContext context)
        {
            _context = context;
        }

        // Returns all games with ratio information
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameWithRatio>>> GetGamesWithRatio()
        {
            return await _context.GamesWithRatio.ToListAsync();
        }

        // Returns a specific game with ratio by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<GameWithRatio>> GetGameWithRatio(int id)
        {
            var gameWithRatio = await _context.GamesWithRatio.FindAsync(id);
            if (gameWithRatio == null) return NotFound();
            return gameWithRatio;
        }

        // Creates a new game with ratio
        [HttpPost]
        public async Task<ActionResult<GameWithRatio>> CreateGameWithRatio(GameWithRatio gameWithRatio)
        {
            _context.GamesWithRatio.Add(gameWithRatio);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGameWithRatio), new { id = gameWithRatio.RatioID }, gameWithRatio);
        }

        // Updates an existing game with ratio
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGameWithRatio(int id, GameWithRatio gameWithRatio)
        {
            if (id != gameWithRatio.RatioID) return BadRequest();

            _context.Entry(gameWithRatio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await GameWithRatioExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // Deletes a game with ratio by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameWithRatio(int id)
        {
            var gameWithRatio = await _context.GamesWithRatio.FindAsync(id);
            if (gameWithRatio == null) return NotFound();

            _context.GamesWithRatio.Remove(gameWithRatio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Checks if a game with ratio exists by ID
        private async Task<bool> GameWithRatioExists(int id)
        {
            return await _context.GamesWithRatio.AnyAsync(e => e.RatioID == id);
        }
    }
}