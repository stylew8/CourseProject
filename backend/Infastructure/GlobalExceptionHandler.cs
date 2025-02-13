using Microsoft.AspNetCore.Mvc;
using System.Net;
using Server.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Server.Infrastructure
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        private readonly IProblemDetailsService _problemDetailsService;

        public GlobalExceptionHandler(
            ILogger<GlobalExceptionHandler> logger,
            IProblemDetailsService problemDetailsService)
        {
            _logger = logger;
            _problemDetailsService = problemDetailsService;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            httpContext.Response.ContentType = "application/problem+json";

            if (exception is RegistrationException regEx)
            {
                _logger.LogWarning($"Registration error: {regEx.Message}");
                httpContext.Response.StatusCode = regEx.StatusCode;

                return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
                {
                    HttpContext = httpContext,
                    ProblemDetails = new ProblemDetails()
                    {
                        Status = regEx.StatusCode,
                        Title = "Registration Error",
                        Detail = regEx.Message
                    }
                });
            }
            else if (exception is AuthenticationException authEx)
            {
                _logger.LogWarning($"Authentication error: {authEx.Message}");
                httpContext.Response.StatusCode = authEx.StatusCode;

                return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
                {
                    HttpContext = httpContext,
                    ProblemDetails = new ProblemDetails()
                    {
                        Status = authEx.StatusCode,
                        Title = "Authentication Error",
                        Detail = authEx.Message
                    }
                });
            }
            else if (exception is ValidationException valEx)
            {
                _logger.LogWarning($"Validation error: {valEx.Message}");
                httpContext.Response.StatusCode = valEx.StatusCode;

                return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
                {
                    HttpContext = httpContext,
                    ProblemDetails = new ProblemDetails()
                    {
                        Status = valEx.StatusCode,
                        Title = "Validation Error",
                        Detail = valEx.Message
                    }
                });
            }

            _logger.LogError(exception, "An unhandled exception occurred.");
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext()
            {
                HttpContext = httpContext,
                ProblemDetails = new ProblemDetails()
                {
                    Status = (int)HttpStatusCode.InternalServerError,
                    Title = "Internal Server Error",
                    Detail = exception.Message,
                    Instance = httpContext.Request.Path
                }
            });
        }
    }
}
