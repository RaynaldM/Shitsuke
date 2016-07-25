using LMS.web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace LMS.web.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<LMS.web.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(LMS.web.Models.ApplicationDbContext context)
        {
            context.Roles.AddOrUpdate(p => p.Id,
              new IdentityRole("Reader"),
              new IdentityRole("Admin")
              );


            var userStore = new UserStore<ApplicationUser>(context);
            var userManager = new UserManager<ApplicationUser>(userStore);

            if (!(context.Users.Any(u => u.UserName == "landry.schmitt@soget.fr")))
            {
                var userToInsert = new ApplicationUser
                {
                    UserName = "landry.schmitt@soget.fr",
                    Email = "landry.schmitt@soget.fr",
                    EmailConfirmed = true
                };
                userManager.Create(userToInsert, "74108520");
                userManager.AddToRole(userToInsert.Id, "Admin");
            }
            if (!(context.Users.Any(u => u.UserName == "raynald.messie@soget.fr")))
            {
                var userToInsert = new ApplicationUser
                {
                    UserName = "raynald.messie@soget.fr",
                    Email = "raynald.messie@soget.fr",
                    EmailConfirmed = true
                };
                userManager.Create(userToInsert, "74108520");
                userManager.AddToRole(userToInsert.Id, "Admin");
            }
            base.Seed(context);
        
        }
    }
}
