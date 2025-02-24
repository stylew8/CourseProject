using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class LikeRepository : ILikeRepository
{
    private readonly AppDbContext _context;
    public LikeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetLikesCountAsync(int templateId)
    {
        return await _context.Likes.CountAsync(l => l.TemplateId == templateId);
    }

    public async Task<bool> UserHasLikedAsync(int templateId, string userId)
    {
        return await _context.Likes.AnyAsync(l => l.TemplateId == templateId && l.UserId == userId);
    }

    public async Task<bool> AddLikeAsync(Like like)
    {
        if (await UserHasLikedAsync(like.TemplateId, like.UserId))
            return false;
        _context.Likes.Add(like);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveLikeAsync(int templateId, string userId)
    {
        var like = await _context.Likes.FirstOrDefaultAsync(l => l.TemplateId == templateId && l.UserId == userId);
        if (like == null)
            return false;
        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();
        return true;
    }
}