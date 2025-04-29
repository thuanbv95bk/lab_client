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
    public interface IVehicleGroupsService : IBaseService
    {
        /// <summary>Danh sách nhóm phương tiện chưa được gán</summary>
        /// <param name="filter">bộ lọc nhóm phương tiện</param>
        /// <param name="includeParentIfAssigned">if set to <c>true</c> [include parent if assigned].</param>
        /// Author: thuanbv
        /// Created: 4/22/2025
        /// Modified: date - user - description
        ServiceStatus GetListUnassignGroups(VehicleGroupsFilter filter, bool includeParentIfAssigned = false);

        /// <summary>Xây cây cha-con của danh sách nhóm</summary>
        /// <param name="listItem">Danh sách nhom cần xây</param>
        /// Author: thuanbv
        /// Created: 4/22/2025
        /// Modified: date - user - description
        List<VehicleGroups> BuildHierarchy(List<VehicleGroups> listItem);
    }
}
