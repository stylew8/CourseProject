﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Models
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<UserInformation> UserInformations { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserInformation>()
                .HasOne(ui => ui.User)
                .WithOne()
                .HasForeignKey<UserInformation>(ui => ui.UserId);

            builder.Entity<Template>()
                .HasMany(t => t.Questions)
                .WithOne(q => q.Template)
                .HasForeignKey(q => q.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Question>()
                .HasMany(q => q.Options)
                .WithOne(o => o.Question)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Question>()
                .HasIndex(q => new { q.TemplateId, q.Order });
            builder.Entity<Option>()
                .HasIndex(o => new { o.QuestionId, o.Order });
        }
    }
}
