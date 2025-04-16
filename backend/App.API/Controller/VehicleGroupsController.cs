using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
using App.Lab.App.Service.Interface;
using App.Lab.App.Model;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/groups")]
    public class VehicleGroupsController : BaseController
    {
        private readonly IVehicleGroupsService _service;

        public VehicleGroupsController(IVehicleGroupsService service)
        {
            _service = service;
        }


        [HttpPost]
        [Route("GetList")]
        public async Task<IActionResult> GetList(VehicleGroupsFilter filter)
        {
            var ret = await Task.Run(() => _service.GetList(filter));
            return Success(ret);
        }

        [HttpPost]
        [Route("GetListUnassignGroups")]
        public async Task<IActionResult> GetListUnassignGroups(VehicleGroupsFilter filter)
        {
            var ret = await Task.Run(() => _service.GetListUnassignGroups(filter));
            return Success(ret);
        }

    }
}