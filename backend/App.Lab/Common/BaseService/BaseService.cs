using App.Common.Helper;
using Microsoft.AspNetCore.Http;

namespace App.Common.BaseService
{
    public class BaseService : Accessor
    {
        public BaseService(IHttpContextAccessor accessor) : base(accessor) { }
    }

    public class BaseService<TRepository> : BaseService
    {
        protected readonly TRepository _repo;

        public BaseService(IHttpContextAccessor accessor, TRepository repo) : base(accessor)
        {
            _repo = repo;
        }
    }
}
