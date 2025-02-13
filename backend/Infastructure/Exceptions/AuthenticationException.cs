using System.Net;

public class AuthenticationException : Exception
    {
        public int StatusCode { get; }

        public AuthenticationException(string message, int statusCode = (int)HttpStatusCode.Unauthorized)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }