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
       

        [HttpPost]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var ret = _service.GetAll();
            return Success(ret);
        }

        [HttpPost]
        [Route("GetList")]
        public async Task<IActionResult> GetList(UsersFilter filter)
        {
            var ret =  _service.GetList(filter);
            return Success(ret);
        }


    }
}