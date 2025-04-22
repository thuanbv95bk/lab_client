using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Repository.Interface
{
    public interface IAdminUserVehicleGroupRepository
    {
        /// <summary>Tạo mới 1 nhóm phương tiện theo user</summary>
        /// <param name="obj">nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        Task Create(AdminUserVehicleGroup obj);
        /// <summary> Xóa mềm 1 nhóm phương tiện theo user </summary>
        /// <param name="item">nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        /// 
        Task DeleteSoft(AdminUserVehicleGroup item);

        /// <summary> Cập nhật 1 nhóm phương tiện theo user </summary>
        /// <param name="item">nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        /// 
        Task Update(AdminUserVehicleGroup item);

        /// <summary> Lấy danh sách nhóm phương tiện theo user </summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        /// 
        List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter);

        /// <summary> Lấy danh sách nhóm phương tiện theo user, bao gồm tên nhóm </summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện theo user</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        ///
        List<VehicleGroups> GetListView(AdminUserVehicleGroupFilter filter);


    }
}
