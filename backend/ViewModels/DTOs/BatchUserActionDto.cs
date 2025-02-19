namespace backend.ViewModels.DTOs;

public class BatchUserActionDto
{
    public List<string> UserIds { get; set; } = new List<string>();
    public string Action { get; set; }
    public string Role { get; set; }
}