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
    }
}
