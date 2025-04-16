using App.Common.BaseService;
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
        //string Create(VehicleGroups obj);
        //void Update(VehicleGroups obj);
        //void Delete(string id);
        //VehicleGroups GetById(int id);
        //List<VehicleGroups> GetAll();
        List<VehicleGroups> GetList(VehicleGroupsFilter filter);
        List<VehicleGroups> GetListUnassignGroups(VehicleGroupsFilter filter);
    }
}
