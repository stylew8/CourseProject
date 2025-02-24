using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly AppDbContext _context;
    public CommentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Comment>> GetCommentsByTemplateIdAsync(int templateId)
    {
        return await _context.Comments
            .Include(x=>x.User)
            .Where(c => c.TemplateId == templateId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Comment> AddCommentAsync(Comment comment)
    {
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return comment;
    }
}