
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Runtime.CompilerServices;



namespace App.Lab.Repository.Implement
{
    public class AdminUsersRepository : Repo, IAdminUsersRepository
    {
        public AdminUsersRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Admin"; }
        public AdminUsersRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Admin"; }

        /// <summary>Get danh sách User</summary>
        /// <param name="filter">Class User</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        public List<Users> GetList(Users filter)
        {

            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "Fullname",
                OrderType = "ASC",
            }};
            var listFilter = MapFilterToOptions(filter);
            this.GetTableData
            (
                out List<Users> ret
                , "Users", null, listFilter, listOrderOption
            );
            return ret;

            //var ret = ExecuteReader<Users>
            //(
            //    "SELECT * FROM [Admin.Users] WHERE FK_CompanyID = @FK_CompanyID AND IsDeleted = @IsDeleted AND IsLock = @IsLock ORDER BY Fullname",
            //CommandType.Text,
            //    new { FK_CompanyID = filter.FK_CompanyID, IsDeleted = filter.IsDeleted, IsLock= filter.IsLock }
            //);
            //return ret;
        }
    }

}
