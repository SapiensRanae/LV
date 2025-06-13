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
    }
}