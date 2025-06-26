using Microsoft.EntityFrameworkCore;
using CasinoApi.Models;

namespace CasinoApi.Data
{
    public class CasinoDbContext : DbContext
    {
        public CasinoDbContext(DbContextOptions<CasinoDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<GameTransaction> GameTransactions { get; set; } = null!;
        public DbSet<FinancialTransaction> FinancialTransactions { get; set; } = null!;
        public DbSet<GameWithRatio> GamesWithRatio { get; set; } = null!;
        public DbSet<UserHistory> UserHistory { get; set; } = null!;
    

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Game>()
        .Property(g => g.MinimalDeposit)
        .HasColumnType("decimal(18,4)");

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

    modelBuilder.Entity<FinancialTransaction>()
        .Property(ft => ft.CashAmount)
        .HasColumnType("decimal(18,4)");
    modelBuilder.Entity<FinancialTransaction>()
        .Property(ft => ft.PreviousBalance)
        .HasColumnType("decimal(18,4)");
    modelBuilder.Entity<FinancialTransaction>()
        .Property(ft => ft.NewBalance)
        .HasColumnType("decimal(18,4)");

    modelBuilder.Entity<User>()
        .Property(u => u.Balance)
        .HasColumnType("decimal(18,4)");
}}
}