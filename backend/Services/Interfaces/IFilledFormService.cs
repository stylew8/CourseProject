using backend.ViewModels.DTOs;

namespace backend.Services.Interfaces;

public interface IFilledFormService
{
    Task<FilledFormDto> GetFilledFormAsync(int formId);
    Task UpdateFilledFormAsync(int formId, EditFilledFormDto filledFormDto);
}