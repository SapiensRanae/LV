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
    public class FinancialTransactionsController : ControllerBase
    {
        private readonly CasinoDbContext _context;

        public FinancialTransactionsController(CasinoDbContext context)
        {
            _context = context;
        }

        // Returns all financial transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FinancialTransaction>>> GetFinancialTransactions()
        {
            return await _context.FinancialTransactions.ToListAsync();
        }

        // Returns a specific financial transaction by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<FinancialTransaction>> GetFinancialTransaction(int id)
        {
            var transaction = await _context.FinancialTransactions.FindAsync(id);
            if (transaction == null) return NotFound();
            return transaction;
        }

        // Creates a new financial transaction and updates user balance
        [HttpPost]
        public async Task<ActionResult<FinancialTransaction>> CreateFinancialTransaction(FinancialTransaction transaction)
        {
            if (transaction.TransactionType != "deposit" && transaction.TransactionType != "withdrawal")
            {
                return BadRequest(new { message = "TransactionType must be 'deposit' or 'withdrawal'." });
            }

            var user = await _context.Users.FindAsync(transaction.UserID);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            user.Balance = transaction.NewBalance;

            _context.FinancialTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFinancialTransaction), new { id = transaction.FinancialTransactionID }, transaction);
        }

        // Updates an existing financial transaction
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFinancialTransaction(int id, FinancialTransaction transaction)
        {
            if (id != transaction.FinancialTransactionID) return BadRequest();

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

        // Deletes a financial transaction by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFinancialTransaction(int id)
        {
            var transaction = await _context.FinancialTransactions.FindAsync(id);
            if (transaction == null) return NotFound();

            _context.FinancialTransactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Checks if a transaction exists by ID
        private async Task<bool> TransactionExists(int id)
        {
            return await _context.FinancialTransactions.AnyAsync(e => e.FinancialTransactionID == id);
        }
    }
}