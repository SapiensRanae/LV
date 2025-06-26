// UserHistoryDto.cs
public class UserHistoryDto
{
    public int StatisticID { get; set; }
    public int UserID { get; set; }
    public int GameTransactionID { get; set; }
    public GameTransactionDto GameTransaction { get; set; }
}

public class GameTransactionDto
{
    public decimal Amount { get; set; }
    public bool IsWin { get; set; }
    public DateTime Timestamp { get; set; }
    public GameDto Game { get; set; }
}

public class GameDto
{
    public string Name { get; set; }
}