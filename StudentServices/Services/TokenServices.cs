using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using StudentServices.Model;

namespace StudentServices.Services
{
    public class TokenServices
    {
        private readonly IConfiguration _config;
        public TokenServices(IConfiguration config) => _config = config;

        public string GenerateToken(User user)
        {
            var jwt = _config.GetSection("Jwt");
            var key = jwt["Key"];
            var issuer = jwt["Issuer"];
            var audience = jwt["Audience"];
            var expireMinutes = int.Parse(jwt["ExpireMinutes"]);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Username ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? "Admin"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var cred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: cred
            );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}

