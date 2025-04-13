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
        [Route("AddOrEdit")]
        public async Task<IActionResult> Create(Users item)
        {
            string id = "";
            if (string.IsNullOrEmpty(item.PK_UserID) || item.PK_UserID.ToLower()== "newid()")
                id = await Task.Run(() => _service.Create(item));
            else
                await Task.Run(() => _service.Update(item));
            return Success(id);
        }
        [HttpPost]
        [Route("GetById")]
        public async Task<IActionResult> GetById(string id)
        {
            var ret = await Task.Run(() => _service.GetById(id));
            return Success(ret);
        }

        [HttpPost]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            await Task.Run(() => _service.Delete(id));
            return Success();
        }

        [HttpPost]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var ret = await Task.Run(() => _service.GetAll());
            return Success(ret);
        }

        [HttpPost]
        [Route("GetList")]
        public async Task<IActionResult> GetList(UsersFilter filter)
        {
            var ret = await Task.Run(() => _service.GetList(filter));
            return Success(ret);
        }


    }
}