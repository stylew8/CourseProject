using System.Net;

namespace Server.Infrastructure.Exceptions
{
    public class RegistrationException : Exception
    {
        public int StatusCode { get; }

        public RegistrationException(string message, int statusCode = (int)HttpStatusCode.BadRequest)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}