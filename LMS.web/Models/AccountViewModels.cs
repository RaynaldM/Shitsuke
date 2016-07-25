using System.ComponentModel.DataAnnotations;
using LMS.Resources;

namespace LMS.web.Models
{
    // TODO : vérifier si pas utilisé et supprimer
    //public class ForgotViewModel
    //{
    //    [Required]
    //    [Display(Name = "Courrier électronique")]
    //    public string Email { get; set; }
    //}

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email", ResourceType = typeof(Account))]
      //  [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password", ResourceType = typeof(Account))]
        public string Password { get; set; }

        [Display(Name = "RememberMe", ResourceType = typeof(Account))]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        //[Display(Name = "Courrier électronique")]
        [Display(Name = "Email", ResourceType = typeof(Account))]
        public string Email { get; set; }

        [Required]
        //[StringLength(100, ErrorMessage = "La chaîne {0} doit comporter au moins {2} caractères.", MinimumLength = 6)]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceName = "ErrorStringLength", ErrorMessageResourceType = typeof(Account))]
        [DataType(DataType.Password)]
        //[Display(Name = "Mot de passe")]
        [Display(Name = "Password", ResourceType = typeof(Account))]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        //[Display(Name = "Confirmer le mot de passe ")]
        [Display(Name = "PasswordConfirm", ResourceType = typeof(Account))]
        //[Compare("Password", ErrorMessage = "Le mot de passe et le mot de passe de confirmation ne correspondent pas.")]
        [Compare("Password", ErrorMessageResourceName = "ErrorPasswordConfirm", ErrorMessageResourceType = typeof(Account))]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        //[Display(Name = "Courrier électronique")]
        [Display(Name = "Email", ResourceType = typeof(Account))]
        public string Email { get; set; }

        [Required]
        //[StringLength(100, ErrorMessage = "La chaîne {0} doit comporter au moins {2} caractères.", MinimumLength = 6)]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceName = "ErrorStringLength", ErrorMessageResourceType = typeof(Account))]
        [DataType(DataType.Password)]
        //[Display(Name = "Mot de passe")]
        [Display(Name = "Password", ResourceType = typeof(Account))]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        //[Display(Name = "Confirmer le mot de passe")]
        [Display(Name = "PasswordConfirm", ResourceType = typeof(Account))]
        //[Compare("Password", ErrorMessage = "Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas.")]
        [Compare("Password", ErrorMessageResourceName = "ErrorNewPasswordConfirm", ErrorMessageResourceType = typeof(Account))]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        //[Display(Name = "E-mail")]
        [Display(Name = "Email", ResourceType = typeof(Account))]
        public string Email { get; set; }
    }
}
