using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var (success, token, message, user) = await _authService.RegisterAsync(
                request.Name,
                request.Email,
                request.Password,
                request.RoleId
                );

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { token, message, user = MapUserToDto(user) });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, token, message, user) = await _authService.LoginAsync(
                request.Email,
                request.Password
                );

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { token, message, user = MapUserToDto(user) });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var (success, token, message, user) = await _authService.GoogleLoginAsync(request.GoogleToken);

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { token, message, user = MapUserToDto(user) });
        }
        
        private object MapUserToDto(User? user)
        {
            return new
            {
                id = user!.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role.Name,
            };
        }
    }

    // Request models
    public record RegisterRequest(string Name, string Email, string Password, int RoleId);
    public record LoginRequest(string Email, string Password);
    public record GoogleLoginRequest(string GoogleToken);
}
