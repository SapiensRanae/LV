using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Represents a user's game transaction history record
    public class UserHistory
    {
        [Key]
        public int StatisticID { get; set; } // Primary key

        public int UserID { get; set; } // Associated user ID

        public int GameTransactionID { get; set; } // Associated game transaction ID

        // Navigation property to User
        [JsonIgnore]
        public User User { get; set; }

        // Navigation property to GameTransaction
        [JsonIgnore]
        public GameTransaction GameTransaction { get; set; }
    }
}