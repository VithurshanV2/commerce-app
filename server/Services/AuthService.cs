using server.Models;
using server.Repositories;

namespace server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;
        private readonly IGoogleAuthService _googleAuthService;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtService jwtService,
            IGoogleAuthService googleAuthService
            )
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
            _googleAuthService = googleAuthService;
        }

        public async Task<(bool Success, string Token, string Message)> RegisterAsync(
            string name, string email, string password, int roleId)
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(email))
            {
                return (false, string.Empty, "Email already registered");
            }

            // Create new user
            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = _passwordHasher.HashPassword(password),
                RoleId = roleId
            };

            await _userRepository.CreateAsync(user);

            // Get user with role for token generation
            var createdUser = await _userRepository.GetByEmailAsync(email);
            var token = _jwtService.GenerateToken(createdUser!);

            return (true, token, "Registration successful");
        }

        public async Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return (false, string.Empty, "Invalid email or password");
            }

            // Verify password
            if (!_passwordHasher.VerifyPassword(password, user.PasswordHash))
            {
                return (false, string.Empty, "Invalid email or password");
            }

            // Generate token
            var token = _jwtService.GenerateToken(user);

            return (true, token, "Login successful");
        }

        public async Task<(bool Success, string Token, string Message)> GoogleLoginAsync(string googleToken)
        {
            var (success, email, name) = await _googleAuthService.ValidateGoogleTokenAsync(googleToken);        
        
            if (!success)
            {
                return (false, string.Empty, "Invalid Google token");
            }

            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    Name = name,
                    Email = email,
                    PasswordHash = string.Empty,
                    GoogleId = email,
                    RoleId = 2
                };

                await _userRepository.CreateAsync(user);
                user = await _userRepository.GetByEmailAsync(email);
            }

            var token = _jwtService.GenerateToken(user!);

            return (true, token, "Google login successful");
        }
    }
}
