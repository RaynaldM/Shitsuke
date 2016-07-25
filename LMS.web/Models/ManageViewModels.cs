using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using LMS.Resources;

namespace LMS.web.Models
{
    public class IndexViewModel
    {
        public bool HasPassword { get; set; }
        public IList<UserLoginInfo> Logins { get; set; }
        public string PhoneNumber { get; set; }
        public bool TwoFactor { get; set; }
        public bool BrowserRemembered { get; set; }
    }

    public class ChangePasswordViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        //[Display(Name = "Current Password")]
        [Display(Name = "CurrentPassword", ResourceType = typeof(Account))]
        public string OldPassword { get; set; }

        [Required]
        //[StringLength(100, ErrorMessage = "{0} should have more than {2} characters", MinimumLength = 6)]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceName = "ErrorStringLength", ErrorMessageResourceType = typeof(Account))]
        [DataType(DataType.Password)]
        //[Display(Name = "New Password")]
        [Display(Name = "NewPassword", ResourceType = typeof(Account))]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        //[Display(Name = "Confirm New Password")]
        [Display(Name = "NewPasswordConfirm", ResourceType = typeof(Account))]
        //[Compare("NewPassword", ErrorMessage = "The new Password and Confirm Password don't match")]
        [Compare("NewPassword", ErrorMessageResourceName = "ErrorNewPasswordConfirm", ErrorMessageResourceType = typeof(Account))]
        public string ConfirmPassword { get; set; }
    }
}