using App.Common.Helper;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.App.Repository.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
            //return "";

           
        string sql = @"
            INSERT INTO VehicleGroups (
                FK_CompanyID,
                ParentVehicleGroupId,
                Name,
                IsDeleted,
                Status,
                Level,
                hasChild,
                isHideChildren,
                isHide
            ) VALUES (
                @FK_CompanyID,
                @ParentVehicleGroupId,
                @Name,
                @IsDeleted,
                @Status,
                @Level,
                @hasChild,
                @isHideChildren,
                @isHide
            );
            SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = this.MapToSqlParameters(obj);

            var newId = this.ExecuteScalarAs<int>(sql, parameters);
            return newId.ToString();
            
        }

        public void Update(VehicleGroups obj)
        {
            //this.ExecuteNonQuery
            //(
            //    "App_Dic_Domain_update"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
               
            //);
        }

        public void Delete(string objId)
        {
            //this.ExecuteNonQuery("App_Dic_Domain_delete"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(objId));
        }

        public VehicleGroups GetById(int PK_VehicleGroupID)
        {
            string sql = @"select * from [Vehicle.Groups] where PK_VehicleGroupID = @PK_VehicleGroupID";
            var parameters = this.MapToSqlParameters(new { PK_VehicleGroupID });
            //var parameters = this.MapToSqlParameters(PK_VehicleGroupID);

            this.ExecCommand<VehicleGroups>(out var retList, sql, parameters);
            return retList.FirstOrDefault();
        }
        public UserVehicleGroupView GetViewById(int PK_VehicleGroupID)
        {
            string sql = @"select * from [Vehicle.Groups] where PK_VehicleGroupID = @PK_VehicleGroupID";
            var parameters = this.MapToSqlParameters(new { PK_VehicleGroupID });
            //var parameters = this.MapToSqlParameters(PK_VehicleGroupID);

            this.ExecCommand<UserVehicleGroupView>(out var retList, sql, parameters);
            return retList.FirstOrDefault();
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
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "Name",
                OrderType = "ASC",
            }};
            var listFilter = MapFilterToOptions(filter);
            this.GetTableData
            (
                out List<VehicleGroups> ret
                , "Groups", null, listFilter
            );
            return ret;

        }
        public List<VehicleGroups> GetListNotAssigned(VehicleGroupsFilter filter)
        {
            string sql = @"select * from [Vehicle.Groups] where PK_VehicleGroupID = @PK_VehicleGroupID";
            var parameters = this.MapToSqlParameters(filter);

            this.ExecCommand<VehicleGroups>(out var retList, sql, parameters);
            return retList.Cast<VehicleGroups>().ToList();
        }
    }
}
