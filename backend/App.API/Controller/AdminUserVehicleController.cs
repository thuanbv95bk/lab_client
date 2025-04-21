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

        /// <summary>Gets the list assign groups.</summary>
        /// <param name="filter">AdminUserVehicleGroupFilter</param>
        /// <returns>Danh sách nhóm đã gán</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/18/2025 API lấy danh sách nhóm đã gán theo user
        /// </Modified>

        [HttpPost]
        [Route("get-list-assign-groups")]
        public  IActionResult GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            if (filter.FK_UserID.Length == 0)
            {
                return Failure("Phải chọn người dùng");
            }
            var ret = _service.GetListAssignGroups(filter);

            return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);
        }


        /// <summary>Adds the or edit list.</summary>
        /// <param name="item">VehicleGroupModel</param>
        /// <returns>Status</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/18/2025 Thêm mới/ Cập nhật danh sách nhóm theo người dùng
        /// </Modified>
        [HttpPost]
        [Route("add-or-edit-list")]
        public  IActionResult AddOrEditList(VehicleGroupModel item)
        {
            if (item.PK_UserID.Length == 0 || string.IsNullOrEmpty(item.PK_UserID))
            {
                return Failure("Người dùng trống không thể cập nhật");
            }
            var ret = _service.AddOrEditList(item);
            return ret.IsSuccess ? Success() : Failure(ret.ErroMessage);
        }

    }
}