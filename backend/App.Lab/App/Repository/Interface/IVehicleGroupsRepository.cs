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
        List<VehicleGroups> GetList(VehicleGroupsFilter filter);
        UserVehicleGroupView GetViewById(int objId);
    }
}
