using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("[controller]")]
    public class LikesController : BaseApiController
    {
        private readonly ILikeService _likeService;
        public LikesController(ILikeService likeService)
        {
            _likeService = likeService;
        }

        [HttpGet("{templateId}")]
        public async Task<IActionResult> GetLikes(int templateId)
        {
            var likesCount = await _likeService.GetLikesCountAsync(templateId);
            bool userLiked = false;
            if (User.Identity.IsAuthenticated)
            {
                var userId = GetUserId();
                userLiked = await _likeService.HasUserLikedAsync(templateId, userId);
            }
            return Ok(new { likes = likesCount, userLiked });
        }

        [HttpPost("{templateId}/like")]
        [Authorize]
        public async Task<IActionResult> LikeTemplate(int templateId)
        {
            var userId = GetUserId();

            var result = await _likeService.ToggleLikeAsync(templateId, userId, true);
            return Ok(new { success = result });
        }

        [HttpPost("{templateId}/unlike")]
        [Authorize]
        public async Task<IActionResult> UnlikeTemplate(int templateId)
        {
            var userId = GetUserId();

            var result = await _likeService.ToggleLikeAsync(templateId, userId, false);
            return Ok(new { success = result });
        }
    }
}