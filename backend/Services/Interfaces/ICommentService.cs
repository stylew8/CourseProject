using backend.Repositories.Models;

namespace backend.Services.Interfaces;

public interface ICommentService
{
    Task<List<Comment>> GetCommentsAsync(int templateId);
    Task<Comment> AddCommentAsync(int templateId, string userId, string text);
}