    public class TemplateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }

    public class QuestionDto
    {
        public long Id { get; set; } // Если требуется; иначе можно убрать
        public int Order { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
        public bool ShowInTable { get; set; }
        public List<OptionDto> Options { get; set; }
    }

    public class OptionDto
    {
        public long Id { get; set; } // Если требуется; иначе можно убрать
        public int Order { get; set; }
        public string Value { get; set; }
    }