using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CasinoApi.Models;
using CasinoApi.Data;
using System.Text;
using System.Security.Cryptography;

namespace CasinoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly CasinoDbContext _context;

        public UsersController(CasinoDbContext context)
        {
            _context = context;
        }

        // Get all users with selected fields and user icon as base64
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            return await _context.Users
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.Balance,
                    UserIcon = u.UserIcon != null ? "data:image/png;base64," + Convert.ToBase64String(u.UserIcon) : null,
                    u.PhoneNumber
                })
                .ToListAsync();
        }

        // Get a specific user by ID with selected fields and user icon as base64
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return new
            {
                user.UserID,
                user.Username,
                user.Email,
                user.Role,
                user.Balance,
                UserIcon = user.UserIcon != null ? "data:image/png;base64," + Convert.ToBase64String(user.UserIcon) : null,
                user.PhoneNumber,
                user.Description
            };
        }

        // Create a new user
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
        }

        // DTO for updating user fields
        public class UserUpdateRequest
        {
            public string? Username { get; set; }
            public string? Email { get; set; }
            public string? PhoneNumber { get; set; }
            public string? Description { get; set; }
            public string? UserIcon { get; set; }
            public string? Password { get; set; } 
            public string? Role { get; set; }
        }

        // Update an existing user by ID with provided fields
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Update only provided fields
         
            
            if (request.Username != null)
                user.Username = request.Username;

            if (request.Email != null)
                user.Email = request.Email;

            if (request.PhoneNumber != null)
                user.PhoneNumber = request.PhoneNumber;

            if (request.Description != null)
                user.Description = request.Description;

            if (request.Role != null)
                user.Role = request.Role;
            
            // Update user icon if provided (base64 string)
            if (!string.IsNullOrEmpty(request.UserIcon))
            {
                string base64Data = request.UserIcon;
                if (base64Data.Contains(","))
                {
                    base64Data = base64Data.Split(',')[1];
                }
                user.UserIcon = Convert.FromBase64String(base64Data);
            }
            // Update password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = ComputeHash(request.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await UserExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // Compute SHA256 hash for password
        private string ComputeHash(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // Delete a user by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if a user exists by ID
        private async Task<bool> UserExists(int id)
        {
            return await _context.Users.AnyAsync(e => e.UserID == id);
        }
    }
}