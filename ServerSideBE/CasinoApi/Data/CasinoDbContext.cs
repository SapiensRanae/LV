using Microsoft.EntityFrameworkCore;
using CasinoApi.Models;

namespace CasinoApi.Data
{
    // Database context for the Casino API, manages entity sets and configuration
    public class CasinoDbContext : DbContext
    {
        public CasinoDbContext(DbContextOptions<CasinoDbContext> options) : base(options) { }

        // Users table
        public DbSet<User> Users { get; set; } = null!;
        // Games table
        public DbSet<Game> Games { get; set; } = null!;
        // Game transactions table
        public DbSet<GameTransaction> GameTransactions { get; set; } = null!;
        // Financial transactions table
        public DbSet<FinancialTransaction> FinancialTransactions { get; set; } = null!;
        // Games with ratio table
        public DbSet<GameWithRatio> GamesWithRatio { get; set; } = null!;
        // User history table
        public DbSet<UserHistory> UserHistory { get; set; } = null!;

        // Configure entity properties and relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Set decimal precision for Game.MinimalDeposit
            modelBuilder.Entity<Game>()
                .Property(g => g.MinimalDeposit)
                .HasColumnType("decimal(18,4)");

            // Set decimal precision for GameTransaction properties
            modelBuilder.Entity<GameTransaction>()
                .Property(gt => gt.CashAmount)
                .HasColumnType("decimal(18,4)");
            modelBuilder.Entity<GameTransaction>()
                .Property(gt => gt.PreviousBalance)
                .HasColumnType("decimal(18,4)");
            modelBuilder.Entity<GameTransaction>()
                .Property(gt => gt.NewBalance)
                .HasColumnType("decimal(18,4)");
            modelBuilder.Entity<GameTransaction>()
                .Property(gt => gt.GameResult)
                .HasColumnType("decimal(18,4)");

            // Set decimal precision for FinancialTransaction properties
            modelBuilder.Entity<FinancialTransaction>()
                .Property(ft => ft.CashAmount)
                .HasColumnType("decimal(18,4)");
            modelBuilder.Entity<FinancialTransaction>()
                .Property(ft => ft.PreviousBalance)
                .HasColumnType("decimal(18,4)");
            modelBuilder.Entity<FinancialTransaction>()
                .Property(ft => ft.NewBalance)
                .HasColumnType("decimal(18,4)");

            // Set decimal precision for User.Balance
            modelBuilder.Entity<User>()
                .Property(u => u.Balance)
                .HasColumnType("decimal(18,4)");
        }
    }
}