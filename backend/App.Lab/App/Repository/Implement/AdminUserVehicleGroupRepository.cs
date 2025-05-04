using App.Common.Helper;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
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


        /// <summary>Thêm mới 1 nhóm phương tiện theo user</summary>
        /// <param name="obj">Nhóm phương tiện theo người dùng </param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        public Task Create(AdminUserVehicleGroup obj)
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
            return Task.Run(() => this.ExecuteScalar<int>
            (
                sql
               , CommandType.Text
                , new
                {
                    FK_UserID = obj.FK_UserID,
                    FK_VehicleGroupID = obj.FK_VehicleGroupID,
                    ParentVehicleGroupID = obj.ParentVehicleGroupID,
                    CreatedByUser = obj.CreatedByUser,
                    CreatedDate = obj.CreatedDate,
                    UpdateByUser = obj.UpdateByUser,
                    UpdatedDate = obj.UpdatedDate,
                    UpdatedByUser = obj.UpdatedByUser,
                    IsDeleted = obj.IsDeleted,
                }
            ));

        }
        /// <summary>Cập nhật 1 nhóm phương tiện theo user</summary>
        /// <param name="item">Class nhóm phương tiện</param>
        /// Author: thuanbv
        /// Created: 4/22/2025
        /// Modified: date - user - description
        public Task Update(AdminUserVehicleGroup item)
        {
            string sql =
                 "UPDATE [Admin.UserVehicleGroup] SET IsDeleted = 0 , UpdatedDate = @UpdatedDate" +
                         " WHERE FK_UserID = @FK_UserID " +
                         " AND FK_VehicleGroupID = @FK_VehicleGroupID;";
            return Task.Run(() => this.ExecuteScalar<int>
            (
                sql
               , CommandType.Text
                , new
                {
                    UpdatedDate = item.UpdatedDate,
                    FK_UserID = item.FK_UserID,
                    FK_VehicleGroupID = item.FK_VehicleGroupID,

                }
            ));
        }


        /// <summary>Xóa mềm 1 nhóm phương tiện theo user</summary>
        /// <param name="item">Nhóm phương tiện theo người dùng</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        public Task DeleteSoft(AdminUserVehicleGroup item)
        {

            string sql =
               "UPDATE [Admin.UserVehicleGroup] SET IsDeleted = 1 , UpdatedDate = @UpdatedDate" + " WHERE " +
                                                                "FK_UserID = @FK_UserID " +
                                                                " AND FK_VehicleGroupID = " +
                                                                "@FK_VehicleGroupID " +
                                                                " AND ParentVehicleGroupID = @ParentVehicleGroupID;";

            return Task.Run(() => this.ExecuteScalar<int>
            (
                sql
               , CommandType.Text
                , new
                {
                    UpdatedDate = item.UpdatedDate,
                    FK_UserID = item.FK_UserID,
                    FK_VehicleGroupID = item.FK_VehicleGroupID,
                    ParentVehicleGroupID = item.ParentVehicleGroupID,

                }
            ));

        }


        /// <summary>Lấy danh sách nhóm phương tiện theo user</summary>
        /// <param name="filter">Bộ lọc Nhóm phương tiện theo người dùng</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
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

        /// <summary>danh sách nhóm phương tiện theo user, 
        /// bao gồm tên của nhóm</summary>
        /// <param name="filter">Bộ lọc Nhóm phương tiện theo người dùng</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
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
        }

    }
}
