using backend.Repositories.Models;

namespace backend.Repositories.Interfaces;

public interface ICommentRepository
{
    Task<List<Comment>> GetCommentsByTemplateIdAsync(int templateId);
    Task<Comment> AddCommentAsync(Comment comment);
}