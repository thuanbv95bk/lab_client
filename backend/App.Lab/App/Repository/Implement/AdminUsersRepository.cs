
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using App.DataAccess;
using App.Common.Helper;
using Microsoft.VisualStudio.Services.Common;



namespace App.Lab.Repository.Implement
{
    public class AdminUsersRepository : Repo, IAdminUsersRepository
    {
        public AdminUsersRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Admin"; }
        public AdminUsersRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Admin"; }

        /// <summary>Gets all.</summary>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025  Lấy ra tất cả data của bảng User
        /// </Modified>
        public List<Users> GetAll()
        {
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "UserNameLower",
                OrderType = "ASC",
            }};
            this.GetTableData
            (
            out List<Users> ret
                , "Users", null, null, listOrderOption
            );
            return ret;
        }

        /// <summary>Gets the list.</summary>
        /// <param name="filter">UsersFilter</param>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	get danh sách user theo bộ lọc UsersFilter
        /// </Modified>
        public List<Users> GetList(UsersFilter filter)
        {
            
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "UserNameLower",
                OrderType = "ASC",
            }};
            var listFilter = MapFilterToOptions(filter);
            this.GetTableData
            (
                out List<Users> ret
                , "Users", null, listFilter, listOrderOption
            );
            return ret;

        }
    }

}
