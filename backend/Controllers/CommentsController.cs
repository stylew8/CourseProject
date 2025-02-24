using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("[controller]")]
    public class CommentsController : BaseApiController
    {
        private readonly ICommentService _commentService;
        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("{templateId}")]
        public async Task<IActionResult> GetComments(int templateId)
        {
            var comments = await _commentService.GetCommentsAsync(templateId);
            return Ok(comments);
        }

        [HttpPost("{templateId}")]
        [Authorize]
        public async Task<IActionResult> AddComment(int templateId, [FromBody] CommentDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Text))
                return BadRequest("Comment text cannot be empty.");

            var userId = GetUserId();
            var comment = await _commentService.AddCommentAsync(templateId, userId, dto.Text);
            return Ok(comment);
        }
    }

    public class CommentDto
    {
        public string Text { get; set; }
    }
}