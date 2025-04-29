using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.App.Repository.Interface
{
    public interface IVehicleGroupsRepository
    {
        /// <summary>Lấy về danh sách 1 nhóm phương tiện</summary>
        /// <param name="filter">Bộ lọc nhóm phương tiện</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        List<VehicleGroups> GetList(VehicleGroupsFilter filter);


        /// <summary>get 1 nhóm phương tiện bởi Id </summary>
        /// <param name="objId">Id của nhóm</param>
        /// Author: thuanbv
        /// Created: 4/22/2025
        /// Modified: date - user - description
        UserVehicleGroupView GetViewById(int objId);
    }
}
