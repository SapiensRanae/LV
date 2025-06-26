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
    public class GameWithRatio
    {
        [Key]
        public int RatioID { get; set; }
        public int GameID { get; set; }
        public float GamePayoutRatio { get; set; }

        // Navigation property
[JsonIgnore]
        public Game? Game { get; set; }
    }
}