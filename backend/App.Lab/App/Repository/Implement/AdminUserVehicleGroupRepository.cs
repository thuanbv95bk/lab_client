using App.Common.Helper;
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Repository.Implement
{
    public class AdminUserVehicleGroupRepository : Repo, IAdminUserVehicleGroupRepository
    {
        public AdminUserVehicleGroupRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Admin"; }
        public AdminUserVehicleGroupRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Admin"; }


        public string Create(AdminUserVehicleGroup obj)
        {



            string sql =
               "INSERT INTO [Admin.UserVehicleGroup] " +
                           "(" +
                               "FK_UserID, " +
                               "FK_VehicleGroupID, " +
                               "ParentVehicleGroupID, " +
                               "CreatedByUser, " +
                               "CreatedDate, " +
                               "UpdateByUser, " +
                               "UpdatedDate, " +
                               "UpdatedByUser, " +
                               "IsDeleted " +
                           ") " +
                           "VALUES " +
                           "(" +
                               "@FK_UserID, " +
                               "@FK_VehicleGroupID," +
                               "@ParentVehicleGroupID," +
                               "@CreatedByUser," +
                               "@CreatedDate," +
                               "@UpdateByUser, " +
                               "@UpdatedDate, " +
                               "@UpdatedByUser, " +
                               "@IsDeleted" +
                           "); ";

            var parameters = this.MapToSqlParameters(obj);

            this.ExecCommand(sql, parameters);
            return "";
        }

        public void Update(AdminUserVehicleGroup obj)
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

        public void DeleteSoft(AdminUserVehicleGroup item)
        {

            string sql = "UPDATE [Admin.UserVehicleGroup] SET IsDeleted = 1 , UpdatedDate = @UpdatedDate" + " WHERE " +
                                                                "FK_UserID = @FK_UserID " +
                                                                " AND FK_VehicleGroupID = " +
                                                                "@FK_VehicleGroupID " +
                                                                " AND ParentVehicleGroupID = @ParentVehicleGroupID;";

            var parameters = this.MapToSqlParameters(item);

            this.ExecCommand(sql, parameters);
           
        }


        public AdminUserVehicleGroup GetById(string objId)
        {
            this.ExecuteReader
            (
                out AdminUserVehicleGroup ret
                , "select top 1 * from dbo.[Admin.Users] where PK_UserID ='1FECCEA2-8D0E-433E-8045-079F6ACD6319'"
                , Null.GetDBNull(OrgId)
                , Null.GetDBNull(UserName)
                , Null.GetDBNull(objId)
            );
            var item = new AdminUserVehicleGroup();
            return ret;
        }

        public List<AdminUserVehicleGroup> GetAll()
        {
            this.GetTableData
            (
                out List<AdminUserVehicleGroup> ret
                , "Users"
            );
            return ret;
        }

        public List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter)
        {
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "FK_VehicleGroupID",
                OrderType = "ASC",
            }};
            var listFilter = MapFilterToOptions(filter);

            this.GetTableData
            (
                out List<AdminUserVehicleGroup> ret
                , "UserVehicleGroup", null, listFilter
            );
            return ret;

        }
    }
}
