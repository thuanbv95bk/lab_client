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


        /// <summary>Danh sách các nhóm chưa được gán theo user</summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("get-list-unassign-groups")]
        public IActionResult GetListUnassignGroups(VehicleGroupsFilter filter)
        {

            if (filter.PK_UserID.Length == 0 || string.IsNullOrEmpty(filter.PK_UserID))
            {
                return Failure("Phải chọn người dùng");
            }
            var ret = _service.GetListUnassignGroups(filter);
            return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);

        }

    }
}