using backend.Repositories.Models;

namespace backend.Repositories.Interfaces;

public interface ILikeRepository
{
    Task<int> GetLikesCountAsync(int templateId);
    Task<bool> UserHasLikedAsync(int templateId, string userId);
    Task<bool> AddLikeAsync(Like like);
    Task<bool> RemoveLikeAsync(int templateId, string userId);
}