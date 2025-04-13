using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.App.Repository.Interface;
using App.Lab.App.Service.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Http;


namespace App.Lab.Service.Implement
{ 

    public class AdminUserVehicleGroupService : BaseService<IAdminUserVehicleGroupRepository>, IAdminUserVehicleGroupService
    {
        private readonly IUnitOfWork _uow;

        private readonly IVehicleGroupsRepository _IVehicleGroupsRepo;

        public AdminUserVehicleGroupService(
            IHttpContextAccessor accessor, 
            IAdminUserVehicleGroupRepository repo, 
            IUnitOfWork uow,
            IVehicleGroupsRepository vehicleGroupsRepo
        ) : base(accessor, repo)
        {
            _uow = uow;
            _IVehicleGroupsRepo = vehicleGroupsRepo;
        }

        public string Create(AdminUserVehicleGroup objinfo)
        {
            using (_uow.BeginTransaction())
            {
                var id = _repo.Create(objinfo);
                //if (string.IsNullOrEmpty(id))
                //    return "có lỗi";
                _uow.SaveChanges();
                return id;
            }
        }

        public void Update(AdminUserVehicleGroup objinfo)
        {
            _repo.Update(objinfo);
        }

        public void Delete(string id)
        {
            _repo.Delete(id);
        }

        public AdminUserVehicleGroup GetById(string id)
        {
            return _repo.GetById(id);
        }


        public List<AdminUserVehicleGroup> GetAll()
        {
            return _repo.GetAll();
        }

        public List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter)
        {
            return _repo.GetList(filter);
        }

        public List<UserVehicleGroupView> GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            var res = new List<UserVehicleGroupView>();

            var listAssignGroups = _repo.GetList(filter);

            foreach (var item in listAssignGroups)
            {
                var userVehicleGroup = _IVehicleGroupsRepo.GetViewById(item.FK_VehicleGroupID);
                userVehicleGroup.PK_UserID = filter.FK_UserID;
                res.Add(userVehicleGroup);

                //// Kiểm tra nếu mục có cấp cha
                //if (item.ParentVehicleGroupID.HasValue && (item.ParentVehicleGroupID>0))
                //{
                //    var parentGroup = _IVehicleGroupsRepo.GetViewById(item.ParentVehicleGroupID.Value);
                //    if (parentGroup != null)
                //    {
                //        parentGroup.PK_UserID = filter.FK_UserID;
                //        res.Add(parentGroup);
                //    }
                //}
            }

            //// Xây dựng lại cây cha con cho tất cả các nhóm
            //var tempRes = new List<UserVehicleGroupView>(res);
            //foreach (var group in tempRes)
            //{
            //    BuildChildGroups(group, res, processedGroups);
            //}
            // Xây dựng lại cây cha con cho tất cả các nhóm
            var tempRes = new List<UserVehicleGroupView>(res);
            foreach (var group in tempRes)
            {
                BuildChildGroups(group, res);
            }
            
            return res;
        }


        private void BuildChildGroups(UserVehicleGroupView parentGroup, List<UserVehicleGroupView> res)
        {
            parentGroup.groupsChild = new List<VehicleGroups>();
            var childGroupsToRemove = new List<UserVehicleGroupView>();

            foreach (var childGroup in res.Where(g => g.ParentVehicleGroupId == parentGroup.PK_VehicleGroupID))
            {
                // Thêm nhóm con vào danh sách groupsChild của nhóm cha
                parentGroup.groupsChild.Add(childGroup);

                // Đệ quy để xây dựng cây con cho nhóm con
                BuildChildGroups(childGroup, res);

                // Thêm nhóm con vào danh sách cần loại bỏ
                childGroupsToRemove.Add(childGroup);
            }

            // Loại bỏ các nhóm con khỏi danh sách res
            foreach (var childGroup in childGroupsToRemove)
            {
                res.Remove(childGroup);
            }
        }
    }
}
