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
        [Route("GetListAssignGroups")]
        public async Task<IActionResult> GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            var ret = await Task.Run(() => _service.GetListAssignGroups(filter));
            return Success(ret);
        }

        [HttpPost]
        [Route("AddOrEditList")]
        public async Task<IActionResult> AddOrEditList(VehicleGroupModel item)
        {
            var ret = await Task.Run(() => _service.AddOrEditList(item));
            return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);
        }


    }
}