using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using backend.Services.Interfaces;

namespace backend.Services;

public class LikeService : ILikeService
{
    private readonly ILikeRepository _likeRepository;
    public LikeService(ILikeRepository likeRepository)
    {
        _likeRepository = likeRepository;
    }

    public async Task<int> GetLikesCountAsync(int templateId)
    {
        return await _likeRepository.GetLikesCountAsync(templateId);
    }

    public async Task<bool> HasUserLikedAsync(int templateId, string userId)
    {
        return await _likeRepository.UserHasLikedAsync(templateId, userId);
    }

    public async Task<bool> ToggleLikeAsync(int templateId, string userId, bool like)
    {
        if (like)
        {
            return await _likeRepository.AddLikeAsync(new Like
            {
                TemplateId = templateId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow
            });
        }
        else
        {
            return await _likeRepository.RemoveLikeAsync(templateId, userId);
        }
    }
}