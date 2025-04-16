using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace App.Common.Helper
{
    public class Accessor
    {
        private readonly IHttpContextAccessor _accessor;

        public Accessor() { }

        public Accessor(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public string OrgId
        {
            get
            {
                var identity = (ClaimsIdentity)_accessor?.HttpContext?.User?.Identity;
                var claims = identity?.Claims;
                var obj = claims?.Where(x => x.Type.Equals("orgid")).FirstOrDefault();
                return obj != null && !string.IsNullOrEmpty(obj.Value) ? obj.Value : null;
            }
        }

        public string UserName
        {
            get
            {
                return _accessor?.HttpContext?.User?.Identity?.Name;
            }
        }
    }
}
