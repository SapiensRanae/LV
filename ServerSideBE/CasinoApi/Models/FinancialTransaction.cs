using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CasinoApi.Models
{
    public class FinancialTransaction
    {
        [Key]
        public int FinancialTransactionID { get; set; }
        public int UserID { get; set; }
        public decimal CashAmount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string TransactionType { get; set; }
        public decimal PreviousBalance { get; set; }
        public decimal NewBalance { get; set; }

        // Navigation property
        public User User { get; set; }
    }
}