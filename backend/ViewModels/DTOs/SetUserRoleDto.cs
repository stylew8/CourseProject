namespace backend.ViewModels.DTOs;

public class SetUserRoleDto
{
    public List<string> UserIds { get; set; } = new List<string>();
    public string Role { get; set; }
}