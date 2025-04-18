using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class AdminUsersController : BaseController
    {
        private readonly IAdminUsersService _service;

        public AdminUsersController(IAdminUsersService service)
        {
            _service = service;
        }

        /// <summary>Gets the list.</summary>
        /// <param name="filter">UsersFilter filter</param>
        /// <returns>List<Users></returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/18/2025 	API lấy danh sách người dùng
        /// </Modified>
        [HttpPost]
        [Route("get-list")]
        public async Task<IActionResult> GetList(UsersFilter filter)
        {
            if (filter == null)
            {
                return Failure("Phải nhập tiêu chí tìm kiếm");
            }
            var ret = _service.GetList(filter);
            return Success(ret);
        }
    }
}