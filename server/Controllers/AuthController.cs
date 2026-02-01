using Microsoft.AspNetCore.Mvc;
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
            var (success, token, message) = await _authService.RegisterAsync(
                request.Name,
                request.Email,
                request.Password,
                request.RoleId
                );

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { token, message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, token, message) = await _authService.LoginAsync(
                request.Email,
                request.Password
                );

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(new { token, message });
                
        }
    }

    // Request models
    public record RegisterRequest(string Name, string Email, string Password, int RoleId);
    public record LoginRequest(string Email, string Password);
}
