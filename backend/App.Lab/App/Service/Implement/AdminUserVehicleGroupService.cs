
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

        /// <summary>Adds the or edit list.</summary>
        /// <param name="items">The items.</param>
        /// <returns>ServiceStatus</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/17/2025 	thêm, xóa mềm, cập nhật xóa mềm- active của danh sách nhóm phương tiện của user
        /// </Modified>
        public ServiceStatus AddOrEditList(VehicleGroupModel items)
        {

            try
            {
                // Lấy bản ghi đã xóa mềm
                var dbDeletedList = _repo.GetList(new AdminUserVehicleGroupFilter
                {
                    FK_UserID = items.PK_UserID,
                    IsDeleted = true
                });

                // Lấy bản ghi đang tồn tại
                var dbActiveList = _repo.GetList(new AdminUserVehicleGroupFilter
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
                    d => $"{d.FK_UserID}_{d.FK_VehicleGroupID}",
                    StringComparer.InvariantCultureIgnoreCase
                );

                var dbDeletedDict = dbDeletedList.ToDictionary(
                    d => $"{d.FK_UserID}_{d.FK_VehicleGroupID}",
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
                                ParentVehicleGroupID = deletedItem.ParentVehicleGroupID,
                                FK_VehicleGroupID = deletedItem.FK_VehicleGroupID,
                                FK_UserID = deletedItem.FK_UserID
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
                        var key = $"{dbItem.FK_UserID}_{dbItem.FK_VehicleGroupID}";

                        if (!inputKeys.Contains(key))
                        {
                            _repo.DeleteSoft(new AdminUserVehicleGroup
                            {
                                UpdatedDate = now,
                                IsDeleted = true,
                                ParentVehicleGroupID = dbItem.ParentVehicleGroupID,
                                FK_VehicleGroupID = dbItem.FK_VehicleGroupID,
                                FK_UserID = dbItem.FK_UserID
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

        /// <summary>Gets the list assign groups.</summary>
        /// <param name="filter">AdminUserVehicleGroupFilter<br /></param>
        /// <returns>List&lt;UserVehicleGroupView&gt;</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/17/2025 	danh sách nhóm phương tiện đã gán cho user
        /// </Modified>
        public ServiceStatus GetListAssignGroups(AdminUserVehicleGroupFilter filter)
        {
            try
            {
                var listFlatten = new List<VehicleGroups>();

                var listAssignGroups = _repo.GetListView(filter);
                if (listAssignGroups == null) return ServiceStatus.Success(listFlatten);

                // Build the hierarchy tree
                var tree = BuildHierarchy(listAssignGroups);
                return ServiceStatus.Success(tree);
            }
            catch (Exception ex)
            {
                return ServiceStatus.Failure("Đã xảy ra lỗi trong quá trình lấy danh sách nhóm đã gán!");
            }


        }

        private List<VehicleGroups> BuildHierarchy(List<VehicleGroups> listItem)
        {
            var allIds = listItem
                .Where(x => x.PK_VehicleGroupID != 0)
                .Select(x => x.PK_VehicleGroupID)
                .ToHashSet();

            var rootGroups = listItem.Where(x =>
                x.ParentVehicleGroupId == 0 ||
                x.ParentVehicleGroupId == null ||
                !allIds.Contains(x.ParentVehicleGroupId.Value)
            ).OrderBy(o => o.Name);

            foreach (var level1 in rootGroups)
            {
                level1.Level = 1;
                level1.GroupsChild = GetChildGroups(listItem, level1.PK_VehicleGroupID, 2);
                level1.HasChild = level1.GroupsChild.Any();
                level1.IsHide = false;
            }

            return rootGroups.ToList();
        }

        private List<VehicleGroups> GetChildGroups(List<VehicleGroups> listItem, int? parentId, int level)
        {
            var childGroups = listItem
                .Where(x => x.ParentVehicleGroupId == parentId)
                ;

            foreach (var child in childGroups)
            {
                child.Level = level;
                child.GroupsChild = GetChildGroups(listItem, child.PK_VehicleGroupID, level + 1);
                child.HasChild = child.GroupsChild.Any();
                child.IsHide = false;
            }

            return childGroups.ToList();
        }

    }
}
