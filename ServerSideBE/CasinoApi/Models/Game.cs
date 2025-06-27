using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    // Represents a game with its properties
    public class Game
    {
        [Key]
        public int GameID { get; set; } // Primary key

        public string GameName { get; set; } // Name of the game

        public string Category { get; set; } // Game category

        public string Description { get; set; } // Game description

        public decimal MinimalDeposit { get; set; } // Minimum deposit required to play

        public bool HasRatio { get; set; } // Indicates if the game has a ratio

        // Navigation property for related game transactions
        [JsonIgnore]
        public ICollection<GameTransaction> GameTransactions { get; set; }

        // Navigation property for related GameWithRatio entity
        [JsonIgnore]
        public GameWithRatio GameWithRatio { get; set; }
    }
}