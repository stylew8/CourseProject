    using Microsoft.AspNetCore.Mvc;

    public class TemplateDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Topic { get; set; }

        [ModelBinder(BinderType = typeof(GenericJsonModelBinder<List<int>>))]
        public IEnumerable<int>? TagIds { get; set; }
        public string AccessType { get; set; }

        [ModelBinder(BinderType = typeof(GenericJsonModelBinder<List<string>>))]
        public List<string>? AllowedUserIds { get; set; }

        [ModelBinder(BinderType = typeof(GenericJsonModelBinder<List<QuestionDto>>))]
        public List<QuestionDto> Questions { get; set; }
        public IFormFile? Photo { get; set; }
    }

    public class QuestionDto
    {
        public long Id { get; set; } 
        public int Order { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
        public bool ShowInTable { get; set; }

        [ModelBinder(BinderType = typeof(GenericJsonModelBinder<List<OptionDto>>))]
        public List<OptionDto> Options { get; set; }
    }

    public class OptionDto
    {
        public long Id { get; set; } // Если требуется; иначе можно убрать
        public int Order { get; set; }
        public string Value { get; set; }
    }