using App.Common.BaseService;
using App.Common.Models;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.App.Repository.Interface;
using App.Lab.App.Service.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System.Collections.Immutable;

namespace App.Lab.App.Service.Implement
{
    public class VehicleGroupsService : BaseService<IVehicleGroupsRepository>, IVehicleGroupsService
    {
        private readonly IUnitOfWork _uow;
        private readonly IAdminUserVehicleGroupService _IAdminUserVehicleGroupService;
        private readonly IAdminUserVehicleGroupRepository _IAdminUserVehicleGroupRepository;

        public VehicleGroupsService(
            IHttpContextAccessor accessor,
            IVehicleGroupsRepository repo,
            IUnitOfWork uow,
            IAdminUserVehicleGroupService IAdminUserVehicleGroupService,
            IAdminUserVehicleGroupRepository IAdminUserVehicleGroupRepository
        ) : base(accessor, repo)
        {
            _uow = uow;
            _IAdminUserVehicleGroupService = IAdminUserVehicleGroupService;
            _IAdminUserVehicleGroupRepository = IAdminUserVehicleGroupRepository;
        }


        /// <summary>Gets the list unassign groups.</summary>
        /// <param name="filter">VehicleGroupsFilter</param>
        /// <returns>List&lt;VehicleGroups&gt;</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025  Danh sách nhóm phương tiện chưa được gán
        /// </Modified>

        public ServiceStatus GetListUnassignGroups(VehicleGroupsFilter filter, bool includeParentIfAssigned = true)
        {
            try
            {
                var userID = filter.PK_UserID;
                filter.PK_UserID = null;
                filter.FK_CompanyID = 15076;
                // Lấy toàn bộ nhóm
                var listAllGroups = _repo.GetList(filter);
                if (listAllGroups == null || !listAllGroups.Any())
                    return ServiceStatus.Success(new List<VehicleGroups>());

                // Lấy danh sách nhóm đã gán cho user
                var assignedGroupFilter = new AdminUserVehicleGroupFilter { FK_UserID = userID, IsDeleted = false };
                var assignedGroups = _IAdminUserVehicleGroupRepository.GetList(assignedGroupFilter);
                var assignedIds = assignedGroups.Select(x => x.FK_VehicleGroupID).ToHashSet();

                // Duyệt toàn bộ nhóm, tìm nhóm chưa được gán
                var allGroupsDict = listAllGroups
                    .ToDictionary(x => x.PK_VehicleGroupID!, x => x);

                var resultDict = new Dictionary<int, VehicleGroups>();

                foreach (var group in listAllGroups)
                {
                    if (!assignedIds.Contains(group.PK_VehicleGroupID))
                    {
                        AddGroupWithOptionalParents(group, allGroupsDict, assignedIds, resultDict, includeParentIfAssigned);
                    }
                }

                // Xây cây cha-con
                var flatList = resultDict.Values;
                var tree = BuildHierarchy(flatList.ToList());

                return ServiceStatus.Success(tree); 
            }
            catch (Exception ex)
            {
                return ServiceStatus.Failure("Có lỗi xảy ra, không thể lấy nhóm phương tiện");
            }
            
        }

        // Hàm thêm nhóm và cha của nó nếu cần
        /// <summary>Adds the group with optional parents.</summary>
        /// <param name="group">The group.</param>
        /// <param name="allGroupsDict">All groups dictionary.</param>
        /// <param name="assignedIds">The assigned ids.</param>
        /// <param name="resultDict">Danh sách nhóm phương tiện</param>
        /// <param name="includeParentIfAssigned">if set to <c>true</c> [include parent if assigned].</param>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/17/2025 	Hàm thêm nhóm và cha của nó nếu cần
        /// </Modified>
        private void AddGroupWithOptionalParents(
            VehicleGroups group,
            Dictionary<int, VehicleGroups> allGroupsDict,
            HashSet<int> assignedIds,
            Dictionary<int, VehicleGroups> resultDict,
            bool includeParentIfAssigned)
        {
            if (!resultDict.ContainsKey(group.PK_VehicleGroupID))
            {
                resultDict[group.PK_VehicleGroupID] = group;
            }

            // Nếu có cha
            if (group.ParentVehicleGroupId.HasValue && group.ParentVehicleGroupId.Value != 0)
            {
                var parentId = group.ParentVehicleGroupId.Value;

                if (allGroupsDict.TryGetValue(parentId, out var parentGroup))
                {
                    // Nếu cha đã được gán nhưng người dùng cho phép includeParentIfAssigned => vẫn thêm cha
                    var shouldAddParent = includeParentIfAssigned || !assignedIds.Contains(parentId);

                    if (shouldAddParent && !resultDict.ContainsKey(parentId))
                    {
                        AddGroupWithOptionalParents(parentGroup, allGroupsDict, assignedIds, resultDict, includeParentIfAssigned);
                    }
                }
            }
        }


        /// <summary>Builds the hierarchy.</summary>
        /// <param name="listItem">The list item.</param>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025  Đệ quy để xây cha-con
        /// </Modified>
        public List<VehicleGroups> BuildHierarchy(List<VehicleGroups> listItem)
        {
            var allIds = listItem
                .Where(x => x.PK_VehicleGroupID != 0)
                .Select(x => x.PK_VehicleGroupID)
                .ToHashSet();

            // Gốc là: cha == 0 || cha == null || cha không tồn tại trong listItem
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
                .ToList();

            foreach (var child in childGroups)
            {
                child.Level = level;
                child.GroupsChild = GetChildGroups(listItem, child.PK_VehicleGroupID, level + 1);
                child.HasChild = child.GroupsChild.Any();
                child.IsHide = false;
            }

            return childGroups;
        }

    }
}
