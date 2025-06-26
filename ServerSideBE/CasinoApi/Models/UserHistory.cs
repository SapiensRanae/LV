using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CasinoApi.Models
{
    public class UserHistory
    {
        [Key]
        public int StatisticID { get; set; }
        public int UserID { get; set; }
        public int GameTransactionID { get; set; }

        // Navigation properties
[JsonIgnore]
        public User User { get; set; }
[JsonIgnore]
        public GameTransaction GameTransaction { get; set; }
    }
}