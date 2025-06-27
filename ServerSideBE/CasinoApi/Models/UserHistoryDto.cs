// Data transfer object for user history records
public class UserHistoryDto
{
    public int StatisticID { get; set; } // Unique identifier for the statistic
    public int UserID { get; set; } // Associated user ID
    public int GameTransactionID { get; set; } // Associated game transaction ID
    public GameTransactionDto GameTransaction { get; set; } // Details of the game transaction
}

// Data transfer object for game transactions
public class GameTransactionDto
{
    public decimal Amount { get; set; } // Transaction amount
    public bool IsWin { get; set; } // Indicates if the transaction was a win
    public DateTime Timestamp { get; set; } // Date and time of the transaction
    public GameDto Game { get; set; }// Details of the game
    public decimal GameResult { get; set; }
}

// Data transfer object for games
public class GameDto
{
    public string Name { get; set; } // Name of the game
}