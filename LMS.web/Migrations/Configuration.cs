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

         
            if (!(context.Users.Any(u => u.UserName == "admin@example.com")))
            {
                var userToInsert = new ApplicationUser
                {
                    UserName = "admin@example.com",
                    Email = "admin@example.com",
                    EmailConfirmed = true
                };
                userManager.Create(userToInsert, "123456789");
                userManager.AddToRole(userToInsert.Id, "Admin");
            }
            base.Seed(context);
        
        }
    }
}
