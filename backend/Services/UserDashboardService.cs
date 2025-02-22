using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class UserDashboardService : IUserDashboardService
    {
        private readonly IUserDashboardRepository _repository;

        public UserDashboardService(IUserDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<TemplateDto>> GetUserTemplatesAsync(string userId)
        {
            var templates = await _repository.GetUserTemplatesAsync(userId);
            return templates.Select(t => new TemplateDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Questions = t.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Order = q.Order,
                    Type = q.Type,
                    Text = q.Text,
                    Description = q.Description,
                    ShowInTable = q.ShowInTable,
                    Options = q.Options.Select(o => new OptionDto
                    {
                        Id = o.Id,
                        Order = o.Order,
                        Value = o.Value
                    }).ToList()
                }).ToList()
            }).OrderByDescending(x=>x.Id).ToList();
        }

        public async Task<List<DashboardFilledFormDto>> GetUserFilledFormsForDashboardAsync(string userId)
        {
            var filledForms = await _repository.GetUserFilledFormsAsync(userId);
            return filledForms.Select(f => new DashboardFilledFormDto
            {
                Id = f.Id,
                UserName = f.User != null ? f.User.UserName : f.UserId,
                TemplateName = f.Template.Title,
                SubmittedAt = f.SubmittedAt
            }).ToList();
        }
    }
}
