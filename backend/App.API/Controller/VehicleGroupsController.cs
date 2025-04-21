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

        /// <summary>Gets the list unassign groups.</summary>
        /// <param name="filter">VehicleGroupsFilter</param>
        /// <returns>Danh sách nhóm chưa gán theo user</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/18/2025 Danh sách các nhóm chưa được gán theo user
        /// </Modified>
        [HttpPost]
        [Route("get-list-unassign-groups")]
        public async Task<IActionResult> GetListUnassignGroups(VehicleGroupsFilter filter)
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