using App.Common.Helper;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.App.Repository.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Repository.Implement
{
    
    public class VehicleGroupsRepository : Repo, IVehicleGroupsRepository
    {
        public VehicleGroupsRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Vehicle"; }
        public VehicleGroupsRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Vehicle"; }
        public string Create(VehicleGroups obj)
        {
            //var ret = this.ExecuteScalar
            //(
            //    "App_Dic_Domain_create"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(obj.App_Dic_Domain_Id)
            //    , Null.GetDBNull(obj.App_Org_Id)
            //    , Null.GetDBNull(obj.IsActive)
            //    , Null.GetDBNull(obj.CreatedDate)
            //    , Null.GetDBNull(obj.CreatedUser)
            //    , Null.GetDBNull(obj.DomainCode)
            //    , Null.GetDBNull(obj.ItemCode)
            //    , Null.GetDBNull(obj.ItemValue)
            //    , Null.GetDBNull(obj.OrderValue)
            //    , Null.GetDBNull(obj.Description)
            //);
            return "";
        }

        public void Update(VehicleGroups obj)
        {
            //this.ExecuteNonQuery
            //(
            //    "App_Dic_Domain_update"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(obj.App_Dic_Domain_Id)
            //    , Null.GetDBNull(obj.App_Org_Id)
            //    , Null.GetDBNull(obj.IsActive)
            //    , Null.GetDBNull(obj.UpdatedDate)
            //    , Null.GetDBNull(obj.UpdatedUser)
            //    , Null.GetDBNull(obj.DomainCode)
            //    , Null.GetDBNull(obj.ItemCode)
            //    , Null.GetDBNull(obj.ItemValue)
            //    , Null.GetDBNull(obj.OrderValue)
            //    , Null.GetDBNull(obj.Description)
            //);
        }

        public void Delete(string objId)
        {
            //this.ExecuteNonQuery("App_Dic_Domain_delete"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(objId));
        }

        public VehicleGroups GetById(string objId)
        {
            this.ExecuteReader
            (
                out VehicleGroups ret
                , "select top 1 * from dbo.[Admin.Users] where PK_UserID ='1FECCEA2-8D0E-433E-8045-079F6ACD6319'"
                , Null.GetDBNull(OrgId)
                , Null.GetDBNull(UserName)
                , Null.GetDBNull(objId)
            );
            var item = new VehicleGroups();
            return ret;
        }

        public List<VehicleGroups> GetAll()
        {
            this.GetTableData
            (
                out List<VehicleGroups> ret
                , "Groups"
            );
            return ret;
        }

        public List<VehicleGroups> GetList(VehicleGroupsFilter filter)
        {
            var listFilter = new FilterOption[] {
            new FilterOption {
                Column = "FK_CompanyID",
                Value = (15076).ToString(),
                ValueType = "int"
            }};

            this.GetTableData
            (
                out List<VehicleGroups> ret
                , "Groups", null, listFilter
            );
            return ret;

        }
    }
}
