using App.Common.BaseService;
using App.DataAccess;
using App.Lab.App.Model;
using App.Lab.App.Repository.Interface;
using App.Lab.App.Service.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;

namespace App.Lab.App.Service.Implement
{
    public class VehicleGroupsService : BaseService<IVehicleGroupsRepository>, IVehicleGroupsService
    {
        private readonly IUnitOfWork _uow;
        private readonly IAdminUserVehicleGroupService _IAdminUserVehicleGroupService;

        public VehicleGroupsService(
            IHttpContextAccessor accessor, 
            IVehicleGroupsRepository repo, 
            IUnitOfWork uow,
            IAdminUserVehicleGroupService IAdminUserVehicleGroupService
        ) : base(accessor, repo)
        {
            _uow = uow;
            _IAdminUserVehicleGroupService = IAdminUserVehicleGroupService;
        }


        /// <summary>Gets the list.</summary>
        /// <param name="filter">VehicleGroupsFilter</param>
        /// <returns>List&lt;VehicleGroups&gt;</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	Lấy ra danh sách nhóm phương tiện- wiew theo dạng cây
        /// </Modified>
        public List<VehicleGroups> GetList(VehicleGroupsFilter filter)
        {
            var PK_UserID = filter.PK_UserID;
            filter.PK_UserID = null;
            var listItem= _repo.GetList(filter);

            if (!listItem.Any())
                return null;
            return BuildHierarchy(listItem);

        }

        /// <summary>Gets the list unassign groups.</summary>
        /// <param name="filter">VehicleGroupsFilter</param>
        /// <returns>List&lt;VehicleGroups&gt;</returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025  Danh sách nhóm phương tiện chưa được gán
        /// </Modified>
        public List<VehicleGroups> GetListUnassignGroups(VehicleGroupsFilter filter)
        {
            var PK_UserID = filter.PK_UserID;
            filter.PK_UserID = null;
            var listItem = _repo.GetList(filter);
            var filterAssignGroups = new AdminUserVehicleGroupFilter();
            filterAssignGroups.FK_UserID = PK_UserID;
            var listAssignGroups = _IAdminUserVehicleGroupService.GetListAssignGroups(filterAssignGroups);
            var result = listItem.Where(x => !listAssignGroups.Any(y => y.PK_VehicleGroupID == x.PK_VehicleGroupID)).ToList();
            if (!result.Any())
                return null;
            var listAll= BuildHierarchy(result);

            return listAll;
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
            // Tìm các nhóm gốc (Level 1)
            var rootGroups = listItem.Where(x => x.ParentVehicleGroupId == 0 || x.ParentVehicleGroupId == null).ToList();

            foreach (var level1 in rootGroups)
            {
                level1.Level = 1;
                level1.groupsChild = GetChildGroups(listItem, level1.PK_VehicleGroupID, 2);
                level1.hasChild = level1.groupsChild.Any(); // Kiểm tra nếu có con
                level1.isHide = false;
            }


            return rootGroups;
        }

        private void AddGroupWithChildren(List<VehicleGroups> result, VehicleGroups group)
        {
            result.Add(group); // Thêm phần tử hiện tại vào danh sách kết quả

            if (group.groupsChild != null && group.groupsChild.Any())
            {
                foreach (var child in group.groupsChild)
                {
                    AddGroupWithChildren(result, child); // Đệ quy thêm các phần tử con
                }
            }
        }
        private List<VehicleGroups> GetChildGroups(List<VehicleGroups> listItem, int? parentId, int level)
        {
            var childGroups = listItem.Where(x => x.ParentVehicleGroupId == parentId).ToList();

            foreach (var child in childGroups)
            {
                child.Level = level;
                child.groupsChild = GetChildGroups(listItem, child.PK_VehicleGroupID, level + 1);
                child.hasChild = child.groupsChild.Any(); // Kiểm tra nếu có con
                child.isHide = false;
            }

            return childGroups;
        }
    }
}
