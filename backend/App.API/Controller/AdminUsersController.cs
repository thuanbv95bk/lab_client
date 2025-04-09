using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminUsersController : BaseController
    {
        private readonly IAdminUsersService _service;

        public AdminUsersController(IAdminUsersService service)
        {
            _service = service;
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

        
    }
}