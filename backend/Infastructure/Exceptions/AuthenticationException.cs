using System.Net;
using Server.Infrastructure.Exceptions;

public class AuthenticationException : ApiServiceException
    {
        public AuthenticationException(string message, int statusCode = (int)HttpStatusCode.Unauthorized)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }