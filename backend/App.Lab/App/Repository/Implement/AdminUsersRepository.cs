
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using App.DataAccess;
using App.Common.Helper;


namespace App.Lab.Repository.Implement
{
    public class AdminUsersRepository : Repo, IAdminUsersRepository
    {

        public AdminUsersRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Admin"; }
        public AdminUsersRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Admin"; }

       
        public string Create(Users obj)
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

        public void Update(Users obj)
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

        public Users GetById(string objId)
        {
            this.ExecuteReader
            (
                out Users ret
                , "select top 1 * from dbo.[Admin.Users] where PK_UserID ='1FECCEA2-8D0E-433E-8045-079F6ACD6319'"
                , Null.GetDBNull(OrgId)
                , Null.GetDBNull(UserName)
                , Null.GetDBNull(objId)
            );
            var item = new Users();
            return ret;
        }

        public List<Users> GetAll()
        {
            this.GetTableData
            (
                out List<Users> ret
                , "Users"
            );
            return ret;
        }

        public List<Users> GetList(UsersFilter filter)
        {
            var listFilter = new FilterOption[] {
            new FilterOption {
                Column = "FK_CompanyID",
                Value = (15076).ToString(),
                ValueType = "int"
            }};

            this.GetTableData
            (
                out List<Users> ret
                , "Users", null, listFilter
            );
            return ret;

        }
    }

}
