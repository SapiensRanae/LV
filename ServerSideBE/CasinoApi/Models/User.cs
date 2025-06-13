using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CasinoApi.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public decimal Balance { get; set; }
        public byte[]? UserIcon { get; set; }
        public string? PhoneNumber { get; set; } 
        
        public string? Description { get; set; }
        // Navigation properties
        public ICollection<GameTransaction> GameTransactions { get; set; } = new List<GameTransaction>();
        public ICollection<FinancialTransaction> FinancialTransactions { get; set; } = new List<FinancialTransaction>();
        public ICollection<UserHistory> UserHistory { get; set; } = new List<UserHistory>();
    }
}