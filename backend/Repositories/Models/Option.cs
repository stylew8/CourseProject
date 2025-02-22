// Models/Option.cs

using System.Text.Json.Serialization;

namespace backend.Repositories.Models
{
    public class Option : Entity
    {
        public int Order { get; set; }
        public string Value { get; set; }

        // Связь с вопросом
        public int QuestionId { get; set; }

        [Newtonsoft.Json.JsonIgnore]
        [JsonIgnore]
        public Question Question { get; set; }
    }
}
