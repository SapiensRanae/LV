using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Represents a user in the casino system
    public class User
    {
        [Key]
        public int UserID { get; set; } // Primary key

        public string Role { get; set; } // User role (e.g., admin, player)

        public string Username { get; set; } // Username

        public string Email { get; set; } // User email

        public string PasswordHash { get; set; } // Hashed password

        public decimal Balance { get; set; } // User account balance

        public byte[]? UserIcon { get; set; } // Optional user icon

        public string? PhoneNumber { get; set; } // Optional phone number

        public string? Description { get; set; } // Optional user description

        // Navigation property for related game transactions
        [JsonIgnore]
        public ICollection<GameTransaction> GameTransactions { get; set; } = new List<GameTransaction>();

        // Navigation property for related financial transactions
        public ICollection<FinancialTransaction> FinancialTransactions { get; set; } = new List<FinancialTransaction>();

        // Navigation property for related user history records
        [JsonIgnore]
        public ICollection<UserHistory> UserHistory { get; set; } = new List<UserHistory>();
    }
}