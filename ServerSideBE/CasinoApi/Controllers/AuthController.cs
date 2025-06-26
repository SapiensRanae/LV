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

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                // Log the login attempt
                Console.WriteLine($"Login attempt for email: {request.Email}");
        
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                {
                    Console.WriteLine("User not found in database");
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                Console.WriteLine($"User found: ID={user.UserID}, Username={user.Username}");
        
                // Log password verification attempt
                var computedHash = ComputeHash(request.Password);
                Console.WriteLine($"Stored hash: {user.PasswordHash}");
                Console.WriteLine($"Computed hash: {computedHash}");
        
                if (!VerifyPassword(request.Password, user.PasswordHash))
                {
                    Console.WriteLine("Password verification failed");
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var token = GenerateJwtToken(user);
                Console.WriteLine("Login successful, token generated");

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return StatusCode(500, new { message = "Login failed: " + ex.Message });
            }
        }
        public class RegisterRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public byte[]? UserIcon { get; set; }
            public string? PhoneNumber { get; set; }
            public string? Description { get; set; }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = ComputeHash(request.Password),
                Role = "player",
                Balance = 0,
                UserIcon = request.UserIcon,
                PhoneNumber = request.PhoneNumber,
                Description = request.Description
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate token for the new user
            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        private bool VerifyPassword(string password, string storedHash)
        {

            return ComputeHash(password) == storedHash;
        }

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
