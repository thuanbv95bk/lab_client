using App.Common.BaseService;
using App.Common.Models;
using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace App.Lab.App.Service.Interface
{
    public interface IAdminUserVehicleGroupService : IBaseService
    {
        /// <summary>Lấy danh sách nhóm phương tiện đã gán</summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện đã gán</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        ServiceStatus GetListAssignGroups(AdminUserVehicleGroupFilter filter);

        /// <summary>Thêm, xóa mềm, cập nhật xóa mềm- active của danh sách nhóm phương tiện của user</summary>
        /// <param name="items"> Model thêm mới 1 nhóm phương tiện</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        Task<ServiceStatus> AddOrEditListAsync(VehicleGroupModel item);
    }
}
