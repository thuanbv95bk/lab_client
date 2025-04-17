
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
                // Lấy bản ghi đã xóa mềm
                var dbDeletedList = GetListAssignGroups(new AdminUserVehicleGroupFilter
                {
                    FK_UserID = items.PK_UserID,
                    IsDeleted = true
                });

                // Lấy bản ghi đang tồn tại
                var dbActiveList = GetListAssignGroups(new AdminUserVehicleGroupFilter
                {
                    FK_UserID = items.PK_UserID,
                    IsDeleted = false
                });

                var now = DateTime.Now;

                var inputKeys = new HashSet<string>(
                    items.listGroup.Select(i => $"{i.PK_UserID}_{i.PK_VehicleGroupID}"),
                    StringComparer.InvariantCultureIgnoreCase
                );

                var dbActiveDict = dbActiveList.ToDictionary(
                    d => $"{d.PK_UserID}_{d.PK_VehicleGroupID}",
                    StringComparer.InvariantCultureIgnoreCase
                );

                var dbDeletedDict = dbDeletedList.ToDictionary(
                    d => $"{d.PK_UserID}_{d.PK_VehicleGroupID}",
                    StringComparer.InvariantCultureIgnoreCase
                );

                using (_uow.BeginTransaction())
                {
                    // Xử lý thêm mới hoặc phục hồi
                    foreach (var item in items.listGroup)
                    {
                        var key = $"{item.PK_UserID}_{item.PK_VehicleGroupID}";

                        if (dbActiveDict.ContainsKey(key))
                        {
                            // Đã tồn tại, không cần làm gì
                            continue;
                        }

                        if (dbDeletedDict.TryGetValue(key, out var deletedItem))
                        {
                            // Phục hồi từ xóa mềm
                            _repo.Update(new AdminUserVehicleGroup
                            {
                                UpdatedDate = now,
                                IsDeleted = false,
                                ParentVehicleGroupID = deletedItem.ParentVehicleGroupId,
                                FK_VehicleGroupID = deletedItem.PK_VehicleGroupID,
                                FK_UserID = deletedItem.PK_UserID
                            });
                        }
                        else
                        {
                            // Thêm mới
                            _repo.Create(new AdminUserVehicleGroup
                            {
                                CreatedDate = now,
                                IsDeleted = null,
                                CreatedByUser = item.PK_UserID,
                                ParentVehicleGroupID = item.ParentVehicleGroupId ?? 0,
                                FK_VehicleGroupID = item.PK_VehicleGroupID,
                                FK_UserID = item.PK_UserID
                            });
                        }
                    }

                    // Xử lý xóa mềm: các bản ghi trong dbActive nhưng không có trong input
                    foreach (var dbItem in dbActiveList)
                    {
                        var key = $"{dbItem.PK_UserID}_{dbItem.PK_VehicleGroupID}";

                        if (!inputKeys.Contains(key))
                        {
                           _repo.DeleteSoft(new AdminUserVehicleGroup
                            {
                                UpdatedDate = now,
                                IsDeleted = true,
                                ParentVehicleGroupID = dbItem.ParentVehicleGroupId,
                                FK_VehicleGroupID = dbItem.PK_VehicleGroupID,
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
                // Có thể ghi log chi tiết ex tại đây
                return ServiceStatus.Failure("Đã xảy ra lỗi trong quá trình cập nhật!");
            }
        }

        public List<UserVehicleGroupView> GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            var res = new List<UserVehicleGroupView>() { };

            var listAssignGroups = _repo.GetList(filter);
            if(listAssignGroups == null) return res;

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
    }
}
