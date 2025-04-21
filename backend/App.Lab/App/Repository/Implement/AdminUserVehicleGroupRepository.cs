using App.Common.Helper;
using App.DataAccess;
using App.Lab.App.Model;
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

        /// <summary>Creates the specified object.</summary>
        /// <param name="obj">AdminUserVehicleGroup</param>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	Thêm mới 1 nhóm phương tiện theo user
        /// </Modified>
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
        public void Update(AdminUserVehicleGroup item)
        {

            string sql = "UPDATE [Admin.UserVehicleGroup] SET IsDeleted = 0 , UpdatedDate = @UpdatedDate" + " WHERE " +
                                                                "FK_UserID = @FK_UserID " +
                                                                " AND FK_VehicleGroupID = " +
                                                                "@FK_VehicleGroupID ;"
                                                                ;

            var parameters = this.MapToSqlParameters(item);

            this.ExecCommand(sql, parameters);

        }


        /// <summary>Deletes the soft.</summary>
        /// <param name="item">The item.</param>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	Xóa mềm 1 nhóm phương tiện theo user
        /// </Modified>
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

        /// <summary>Gets the list.</summary>
        /// <param name="filter">AdminUserVehicleGroupFilter</param>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	get danh sách nhóm phương tiện theo user 
        /// </Modified>
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

        public List<VehicleGroups> GetListView(AdminUserVehicleGroupFilter filter)
        {

            string sql = 
                "SELECT G.* FROM dbo.[Vehicle.Groups] G " +
                    "JOIN dbo.[Admin.UserVehicleGroup] A ON A.FK_VehicleGroupID = G.PK_VehicleGroupID" +
                " WHERE A.FK_UserID = @FK_UserID  " +
                    "AND ISNULL(G.IsDeleted, 0) = 0 " +
                    "AND ISNULL(A.IsDeleted, 0) = 0;";
            

            var parameters = this.MapToSqlParameters(filter);

            this.ExecCommand<VehicleGroups>(out var retList, sql, parameters);
            return retList;


            //var listOrderOption = new OrderOption[] {
            //new OrderOption {
            //    Column = "FK_VehicleGroupID",
            //    OrderType = "ASC",
            //}};
            //var listFilter = MapFilterToOptions(filter);

            //this.GetTableData
            //(
            //    out List<VehicleGroups> ret
            //    , "UserVehicleGroup", null, listFilter
            //);
            //return ret;

        }

    }
}
