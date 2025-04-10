using App.Common.BaseService;
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Service.Implement
{
    public class AdminUsersService : BaseService<IAdminUsersRepository>, IAdminUsersService
    {
        private readonly IUnitOfWork _uow;

        public AdminUsersService(IHttpContextAccessor accessor, IAdminUsersRepository repo, IUnitOfWork uow): base(accessor, repo)
        {
            _uow = uow;
        }

        public string Create(Users objinfo)
        {
            return _repo.Create(objinfo);
        }

        public void Update(Users objinfo)
        {
            _repo.Update(objinfo);
        }

        public void Delete(string id)
        {
            _repo.Delete(id);
        }

        public Users GetById(string id)
        {
            return _repo.GetById(id);
        }


        public List<Users> GetAll()
        {
            return _repo.GetAll();
        }

        public List<Users> GetList(UsersFilter filter)
        {
            return _repo.GetList(filter);
        }
    }
}
