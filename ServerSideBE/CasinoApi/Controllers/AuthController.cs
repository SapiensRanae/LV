using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CasinoApi.Data;
using CasinoApi.Models;
using System.Security.Cryptography;

namespace CasinoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CasinoDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(CasinoDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // DTO for login requests
        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // Handles user login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Verify password
                if (!VerifyPassword(request.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login failed: " + ex.Message });
            }
        }

        // DTO for registration requests
        public class RegisterRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public byte[]? UserIcon { get; set; }
            public string? PhoneNumber { get; set; }
            public string? Description { get; set; }
        }

        // Handles user registration
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return Conflict(new { message = "User with this email already exists" });
            }
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return Conflict(new { message = "User with this username already exists" });
            }
            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = ComputeHash(request.Password),
                Role = "player",
                Balance = 0,
           
                PhoneNumber = request.PhoneNumber,
                Description = request.Description
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            // Return both token and user info
            return Ok(new
            {
                token,
                user = new
                {
                    user.UserID,
                    user.Username,
                    user.Email,
                    user.Role,
                    user.Balance,
                    UserIcon = user.UserIcon != null ? "data:image/png;base64," + Convert.ToBase64String(user.UserIcon) : null,
                    user.PhoneNumber,
                    user.Description
                }
            });
        }

        // Verifies if the provided password matches the stored hash
        private bool VerifyPassword(string password, string storedHash)
        {
            return ComputeHash(password) == storedHash;
        }

        // Computes SHA256 hash for a password
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

        // Generates a JWT token for the authenticated user
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "defaultSecretKey123456789012345678901234"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "casinoApi",
                audience: _configuration["Jwt:Audience"] ?? "casinoClients",
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}