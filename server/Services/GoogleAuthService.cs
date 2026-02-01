using Google.Apis.Auth;

namespace server.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _configuration;

        public GoogleAuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<(bool Success, string Email, string Name)> ValidateGoogleTokenAsync(string googleToken)
        {
            try
            {
                var clientId = _configuration["Google:ClientId"];

                if (string.IsNullOrEmpty(clientId))
                {
                    return (false, string.Empty, string.Empty);
                }

                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken, validationSettings);

                return (true, payload.Email, payload.Name);
            }
            catch
            {
                return (false, string.Empty, string.Empty);
            }
        }
    }
}
