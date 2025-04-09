
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using App.DataAccess;
using App.Common.Helper;


namespace App.Lab.Repository.Implement
{
    public class AdminUsersRepository : Repo, IAdminUsersRepository
    {
        public AdminUsersRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { }
       
        public string Create(AdminUsers obj)
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

        public void Update(AdminUsers obj)
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

        public AdminUsers GetById(string objId)
        {
            this.ExecuteReader
            (
                out AdminUsers ret
                , "select top 1 * from dbo.[Admin.Users] where PK_UserID ='1FECCEA2-8D0E-433E-8045-079F6ACD6319'"
                , Null.GetDBNull(OrgId)
                , Null.GetDBNull(UserName)
                , Null.GetDBNull(objId)
            );
            var item = new AdminUsers();
            return ret;



         
        }

        public List<AdminUsers> GetAll()
        {
            this.GetTableData
            (
                out List<AdminUsers> ret
                , "dbo.Admin.Users"

            );
            var  items = new List<AdminUsers>() {  };
            return ret;
        }

        public List<AdminUsers> GetList()
        {
            //this.ExecuteReader(out List<App_Dic_Domain> ret, "App_Dic_Domain_getAllByDomain", Null.GetDBNull(domainCode));
            //return ret;
            var items = new List<AdminUsers>() { };
            return items;

        }
    }

}
