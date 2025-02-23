using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet("tags")]
    // [Authorize]
    public async Task<IActionResult> SearchTags([FromQuery] string query)
    {
        var result = await _searchService.SearchTags(query);
        return Ok(result);
    }

    [HttpGet("users")]
    // [Authorize]
    public async Task<IActionResult> SearchUsers([FromQuery] string query)
    {
        var result = await _searchService.SearchUsers(query);
        return Ok(result);
    }

    [HttpPost("user/validate")]
    public async Task<IActionResult> ValidateUser([FromBody] ValidateUserRequest request)
    {
        var user = await _searchService.ValidateUserEmail(request.Email);

        return Ok(new { user });
    }
}

public record ValidateUserRequest(string Email);