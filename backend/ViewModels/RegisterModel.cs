﻿namespace backend.ViewModels
{
    public class RegisterModel
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
    }
}
