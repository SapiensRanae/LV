using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Financial transaction record for a user
    public class FinancialTransaction
    {
        [Key]
        public int FinancialTransactionID { get; set; } // Transaction primary key

        public int UserID { get; set; } // Associated user ID

        public decimal CashAmount { get; set; } // Transaction amount

        public DateTime Date { get; set; } = DateTime.Now; // Transaction date and time

        public string TransactionType { get; set; } // Transaction type (deposit, withdrawal)

        public decimal PreviousBalance { get; set; } // Balance before transaction

        public decimal NewBalance { get; set; } // Balance after transaction

        [JsonIgnore]
        public User? User { get; set; } // Navigation property to User
    }
}