// Models/Option.cs
namespace backend.Repositories.Models
{
    public class Option
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public string Value { get; set; }

        // Связь с вопросом
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}
