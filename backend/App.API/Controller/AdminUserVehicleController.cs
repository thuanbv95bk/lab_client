using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
using App.Lab.App.Service.Interface;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/user-vehicle-group")]
    public class AdminUserVehicleController : BaseController
    {
        private readonly IAdminUserVehicleGroupService _service;

        public AdminUserVehicleController(IAdminUserVehicleGroupService service)
        {
            _service = service;
        }
        [HttpPost]
        [Route("AddOrEdit")]
        public async Task<IActionResult> Create(AdminUserVehicleGroup item)
        {
            string id = "";
            id = await Task.Run(() => _service.Create(item));
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
        public async Task<IActionResult> GetList(AdminUserVehicleGroupFilter filter)
        {
            var ret = await Task.Run(() => _service.GetList(filter));
            return Success(ret);
        }
        [HttpPost]
        [Route("GetListAssignGroups")]
        public async Task<IActionResult> GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            var ret = await Task.Run(() => _service.GetListAssignGroups(filter));
            return Success(ret);
        }

    }
}