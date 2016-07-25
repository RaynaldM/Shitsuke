using System;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace LMS.Web.Sample.Models
{
    public enum Gender
    {
        homme, femme, inconnu

    }
    public class ExampleViewModels
    {
        [Required]
        [Key]
        [HiddenInput]
        public Guid Id { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [StringLength(128, MinimumLength = 5)]
        public string Name { get; set; }

        [DataType(DataType.Date)]
        public DateTime BirthDayDate { get; set; }
        [DataType(DataType.MultilineText)]
        [StringLength(1024)]
        public string Addresse { get; set; }
        [DataType(DataType.Text)]
        public string Town { get; set; }
        [DataType(DataType.Text)]
        public string Country { get; set; }

        public Gender Gender { get; set; }
        public bool isValid { get; set; }
        [DataType(DataType.Time)]
        public DateTime HourStartWork { get; set; }
        [DataType(DataType.Time)]
        public DateTime HourEndWork { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime NextHolidays { get; set; }

        public int NextHolidaysNumber { get; set; }

        public decimal Salary { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Courrier électronique")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "La chaîne {0} doit comporter au moins {2} caractères.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mot de passe")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmer le mot de passe ")]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "Le mot de passe et le mot de passe de confirmation ne correspondent pas.")]
        public string ConfirmPassword { get; set; }
    }
}