using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    public CommentService(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<List<Comment>> GetCommentsAsync(int templateId)
    {
        var comments = await _commentRepository.GetCommentsByTemplateIdAsync(templateId);

        comments.ForEach(x =>
        {
            if (x.User != null && !string.IsNullOrEmpty(x.User.UserName))
            {
                x.User.UserName = x.User.UserName.Split("@").FirstOrDefault();
            }
        });

        return comments;
    }

    public async Task<Comment> AddCommentAsync(int templateId, string userId, string text)
    {
        var comment = new Comment
        {
            TemplateId = templateId,
            UserId = userId,
            Text = text,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };
        return await _commentRepository.AddCommentAsync(comment);
    }
}