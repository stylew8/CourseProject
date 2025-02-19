using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Repositories.Interfaces;

namespace backend.Repositories
{
    public class UserDashboardRepository : IUserDashboardRepository
    {
        private readonly AppDbContext _dbContext;

        public UserDashboardRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Template>> GetUserTemplatesAsync(string userId)
        {
            return await _dbContext.Templates
                .Where(t => t.CreatorId == userId)
                .Include(t => t.Questions) 
                .ThenInclude(q => q.Options)
                .ToListAsync();
        }

        public async Task<List<FilledForm>> GetUserFilledFormsAsync(string userId)
        {
            return await _dbContext.FilledForms
                .Where(f => f.UserId == userId)
                .Include(f => f.Answers)
                .Include(x=>x.Template)
                .ToListAsync();
        }
    }
}