﻿namespace backend.ViewModels
{
    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
