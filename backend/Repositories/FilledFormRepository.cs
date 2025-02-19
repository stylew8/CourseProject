using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class FilledFormRepository : IFilledFormRepository
{
    private readonly AppDbContext _context;

    public FilledFormRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<FilledForm?> GetFilledFormAsync(int formId)
    {
        return await _context.FilledForms
            .Include(u=>u.User)
            .Include(f => f.Answers)
            .ThenInclude(a => a.Question)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(f => f.Id == formId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}