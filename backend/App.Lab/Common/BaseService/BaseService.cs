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

        /// <summary>Initializes a new instance of the <see cref="BaseService{TRepository}" /> class.</summary>
        /// <param name="accessor">The accessor.</param>
        /// <param name="repo">The repo.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public BaseService(IHttpContextAccessor accessor, TRepository repo) : base(accessor)
        {
            _repo = repo;
        }
    }
}
