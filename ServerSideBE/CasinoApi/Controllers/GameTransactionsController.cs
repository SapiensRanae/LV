using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CasinoApi.Models;
using CasinoApi.Data;   

[ApiController]
[Route("api/[controller]")]
public class GameTransactionsController : ControllerBase
{
    private readonly CasinoDbContext _context;

    public GameTransactionsController(CasinoDbContext context)
    {
        _context = context;
    }

    // Returns all game transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameTransaction>>> GetGameTransactions()
    {
        return await _context.GameTransactions.ToListAsync();
    }

    // Returns a specific game transaction by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<GameTransaction>> GetGameTransaction(int id)
    {
        var transaction = await _context.GameTransactions.FindAsync(id);
        if (transaction == null) return NotFound();
        return transaction;
    }

    // Creates a new game transaction
    [HttpPost]
    public async Task<ActionResult<GameTransaction>> CreateGameTransaction(GameTransaction transaction)
    {
        _context.GameTransactions.Add(transaction);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGameTransaction), new { id = transaction.GameTransactionID }, transaction);
    }

    // Updates an existing game transaction
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGameTransaction(int id, GameTransaction transaction)
    {
        if (id != transaction.GameTransactionID) return BadRequest();

        _context.Entry(transaction).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await TransactionExists(id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // Deletes a game transaction by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGameTransaction(int id)
    {
        var transaction = await _context.GameTransactions.FindAsync(id);
        if (transaction == null) return NotFound();

        _context.GameTransactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Checks if a game transaction exists by ID
    private async Task<bool> TransactionExists(int id)
    {
        return await _context.GameTransactions.AnyAsync(e => e.GameTransactionID == id);
    }
}