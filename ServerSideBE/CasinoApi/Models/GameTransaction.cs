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
    public class GameTransaction
    {
        [Key]
        public int GameTransactionID { get; set; }
        public int UserID { get; set; }
        public int GameID { get; set; }
        public decimal CashAmount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string TransactionType { get; set; }
        public decimal PreviousBalance { get; set; }
        public decimal NewBalance { get; set; }
        public decimal GameResult { get; set; }

        // Navigation properties
[JsonIgnore]
        public User User { get; set; }
[JsonIgnore]        
public Game Game { get; set; }
[JsonIgnore]        
public ICollection<UserHistory> UserHistory { get; set; }
    }
}   