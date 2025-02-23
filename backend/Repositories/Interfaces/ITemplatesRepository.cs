using backend.Repositories.Models;

namespace backend.Repositories.Interfaces;

public interface ITemplatesRepository
{
    Task<Template> CreateTemplateAsync(Template template);
    Task<Template?> GetTemplateByIdFullAsync(int id);
    Task<Template> UpdateTemplateAsync(Template template, TemplateDto dto, bool removeOldQuestions = true);
    Task<Template?> GetTemplateWithQuestionsAsync(int templateId);
    Task AddFilledFormAsync(FilledForm filledForm);
    Task<List<Template>> GetLatestTemplatesAsync();
    Task<List<FilledForm>> GetFilledFormsAsync(int templateId);

    Task<Template?> GetTemplatePhotoAsync(int id);
    Task DeleteTemplatePhotoAsync(int id);
    Task<List<string>> GetTags();
}