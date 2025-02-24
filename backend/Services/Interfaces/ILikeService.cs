namespace backend.Services.Interfaces;

public interface ILikeService
{
    Task<int> GetLikesCountAsync(int templateId);
    Task<bool> HasUserLikedAsync(int templateId, string userId);
    Task<bool> ToggleLikeAsync(int templateId, string userId, bool like);
}