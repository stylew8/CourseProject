using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class SearchRepository : ISearchRepository
{
    private readonly AppDbContext _context;

    public SearchRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> SearchTagsAsync(string query)
    {
        return await _context.Tags
            .Where(t => t.Name.StartsWith(query))
            .ToListAsync();
    }

    public async Task<List<IdentityUser>> SearchUsersAsync(string query)
    {
        return await _context.Users
            .Where(u => u.UserName.Contains(query) || u.Email.Contains(query))
            .ToListAsync();
    }

    public async Task<IdentityUser> SearchUserAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        return user;
    }
}