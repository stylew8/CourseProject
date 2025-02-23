namespace backend.ViewModels.DTOs;

public class GetTemplateDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string PhotoUrl { get; set; }
    public string AccessType { get; set; }
    public int TopicId { get; set; }
    public string Topic { get; set; }
    public string CreatorId { get; set; }

    public List<QuestionDto> Questions { get; set; }
    public List<GetSelectDto> Tags { get; set; }
    public List<GetSelectDto> AllowedUsers { get; set; }
}

public class GetSelectDto
{
    public string Value { get; set; }
    public string Label { get; set; }
}