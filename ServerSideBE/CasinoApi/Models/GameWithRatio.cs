using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Represents a game payout ratio associated with a game
    public class GameWithRatio
    {
        [Key]
        public int RatioID { get; set; } // Primary key

        public int GameID { get; set; } // Associated game ID

        public float GamePayoutRatio { get; set; } // Payout ratio for the game

        // Navigation property to the related Game entity
        [JsonIgnore]
        public Game? Game { get; set; }
    }
}