namespace backend.ViewModels.DTOs;

public class DashboardFilledFormDto
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string TemplateName { get; set; }
    public DateTime SubmittedAt { get; set; }
}