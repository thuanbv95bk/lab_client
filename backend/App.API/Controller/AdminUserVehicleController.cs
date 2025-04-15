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

        [HttpPost]
        [Route("AddOrEditList")]
        public async Task<IActionResult> AddOrEditList(VehicleGroupModel item)
        {
            //string id = "";
            //id = await Task.Run(() => _service.AddOrEditList(items));
            //return Success(id);
            var ret = await Task.Run(() => _service.AddOrEditList(item));
            return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);
        }


        //[HttpPost]
        //[Route("AddOrEditEx")]
        //public async Task<IActionResult> AddOrEditEx(TS_YCTS item)
        //{
        //    dynamic ret;
        //    if (!string.IsNullOrEmpty(item.TS_YCTS_Id))
        //    {
        //        ret = await Task.Run(() => _service.UpdateEx(item));
        //    }
        //    else
        //    {
        //        ret = await Task.Run(() => _service.CreateEx(item));
        //    }
        //    return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);
        //}

    }
}