using System.Net;

namespace Server.Infrastructure.Exceptions
{
    public class RegistrationException : ApiServiceException
    {
        public RegistrationException(string message, int statusCode = (int)HttpStatusCode.BadRequest)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}