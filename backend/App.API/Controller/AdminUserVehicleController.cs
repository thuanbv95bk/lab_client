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



        /// <summary>API lấy danh sách nhóm đã gán theo user</summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 4/22/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("get-list-assign-groups")]
        public  IActionResult GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            if (filter.FK_UserID.Length == 0)
            {
                return Failure("Phải chọn người dùng");
            }
            var ret =  _service.GetListAssignGroups(filter);

            return ret.IsSuccess ? Success(ret.Data) : Failure(ret.ErroMessage);
        }


        /// <summary>Thêm mới/ Cập nhật danh sách nhóm theo người dùng</summary>
        /// <param name="item">model thêm mới danh sách phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("add-or-edit-list")]
        public  async Task<IActionResult> AddOrEditList(VehicleGroupModel item)
        {
            try
            {
                if (item.PK_UserID.Length == 0 || string.IsNullOrEmpty(item.PK_UserID))
                {
                    return Failure("Người dùng trống không thể cập nhật");
                }

                var ret = await _service.AddOrEditListAsync(item);
                return ret.IsSuccess ? Success() : Failure(ret.ErroMessage);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }
           
        }

    }
}