using System.ComponentModel.DataAnnotations;
namespace CasinoApi.Models
{
    public class Game
    {
        [Key]
        public int GameID { get; set; }
        public string GameName { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public decimal MinimalDeposit { get; set; }
        public bool HasRatio { get; set; }

        // Navigation properties
        public ICollection<GameTransaction> GameTransactions { get; set; }
        public GameWithRatio GameWithRatio { get; set; }
    }
}