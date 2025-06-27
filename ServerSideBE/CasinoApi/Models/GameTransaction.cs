using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Represents a transaction for a game played by a user
    public class GameTransaction
    {
        [Key]
        public int GameTransactionID { get; set; } // Transaction primary key

        public int UserID { get; set; } // Associated user ID

        public int GameID { get; set; } // Associated game ID

        public decimal CashAmount { get; set; } // Amount involved in the transaction

        public DateTime Date { get; set; } = DateTime.Now; // Transaction date and time

        public string TransactionType { get; set; } // Type of transaction

        public decimal PreviousBalance { get; set; } // Balance before transaction

        public decimal NewBalance { get; set; } // Balance after transaction

        public decimal GameResult { get; set; } // Result of the game

        // Navigation property to User
        public User User { get; set; }

        // Navigation property to Game
        [JsonIgnore]
        public Game Game { get; set; }

        // Navigation property to related user history records
        [JsonIgnore]
        public ICollection<UserHistory> UserHistory { get; set; }
    }
}