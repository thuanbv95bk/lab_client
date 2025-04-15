using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.Common.Models;
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
                _uow.SaveChanges();
                return id;
            }
        }
        public ServiceStatus AddOrEditList(VehicleGroupModel items)
        {
   
            if (string.IsNullOrEmpty(items.PK_UserID))
                return ServiceStatus.Failure("Người dùng trống không thể cập nhật!");

            try
            {
                var dbList = GetListAssignGroups(new AdminUserVehicleGroupFilter
                {
                    FK_UserID = items.PK_UserID
                }) ;

                var now = DateTime.Now;

                var inputKeys = new HashSet<string>(
                    items.listGroup.Select(i => $"{i.PK_UserID}_{i.PK_VehicleGroupID}"),
                    StringComparer.InvariantCultureIgnoreCase
                );

                var dbKeys = new HashSet<string>(
                    dbList.Select(d => $"{d.PK_UserID}_{d.PK_VehicleGroupID}"),
                    StringComparer.InvariantCultureIgnoreCase
                );

                using (_uow.BeginTransaction())
                {
                    // Thêm mới
                    foreach (var item in items.listGroup)
                    {
                        var key = $"{item.PK_UserID}_{item.PK_VehicleGroupID}";
                        if (!dbKeys.Contains(key))
                        {
                            _repo.Create(new AdminUserVehicleGroup
                            {
                                CreatedDate = now,
                                IsDeleted = null,
                                CreatedByUser = item.PK_UserID,
                                ParentVehicleGroupID = item.ParentVehicleGroupId,
                                FK_VehicleGroupID = item.PK_VehicleGroupID ?? 0,
                                FK_UserID = item.PK_UserID
                            });
                        }
                    }

                    // Xóa mềm
                    foreach (var dbItem in dbList)
                    {
                        var key = $"{dbItem.PK_UserID}_{dbItem.PK_VehicleGroupID}";
                        if (!inputKeys.Contains(key))
                        {
                            _repo.DeleteSoft(new AdminUserVehicleGroup
                            {
                                UpdatedDate = now,
                                IsDeleted = true,
                                ParentVehicleGroupID = dbItem.ParentVehicleGroupId,
                                FK_VehicleGroupID = dbItem.PK_VehicleGroupID ?? 0,
                                FK_UserID = dbItem.PK_UserID
                            });
                        }
                    }

                    _uow.SaveChanges();
                    return ServiceStatus.Success("Cập nhật thành công");
                }
            }
            catch (Exception ex)
            {
                return ServiceStatus.Failure("Đã xảy ra lỗi trong quá trình cập nhật!");
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
            }
           
            //var tempRes = new List<UserVehicleGroupView>(res);
            //foreach (var group in tempRes)
            //{
            //    BuildChildGroups(group, res);
            //}
            
            return res;
        }
        private void BuildChildGroups(UserVehicleGroupView parentGroup, List<UserVehicleGroupView> res)
        {
            var childGroups = res.Where(g => g.ParentVehicleGroupId == parentGroup.PK_VehicleGroupID).ToList();
            if (childGroups.Any())
            {
                parentGroup.groupsChild = new List<VehicleGroups>();

                foreach (var child in childGroups)
                {
                    parentGroup.groupsChild.Add(child);
                    BuildChildGroups(child, res); // Đệ quy xây cây tiếp
                }

                // Xoá nhanh nhóm con khỏi danh sách res
                res.RemoveAll(g => g.ParentVehicleGroupId == parentGroup.PK_VehicleGroupID);
            }
        }

        //private void BuildChildGroups(UserVehicleGroupView parentGroup, List<UserVehicleGroupView> res)
        //{
        //    parentGroup.groupsChild = new List<VehicleGroups>();
        //    var childGroupsToRemove = new List<UserVehicleGroupView>();

        //    foreach (var childGroup in res.Where(g => g.ParentVehicleGroupId == parentGroup.PK_VehicleGroupID))
        //    {
        //        // Thêm nhóm con vào danh sách groupsChild của nhóm cha
        //        parentGroup.groupsChild.Add(childGroup);

        //        // Đệ quy để xây dựng cây con cho nhóm con
        //        BuildChildGroups(childGroup, res);

        //        // Thêm nhóm con vào danh sách cần loại bỏ
        //        childGroupsToRemove.Add(childGroup);
        //    }

        //    // Loại bỏ các nhóm con khỏi danh sách res
        //    foreach (var childGroup in childGroupsToRemove)
        //    {
        //        res.Remove(childGroup);
        //    }
        //}
    }
}
