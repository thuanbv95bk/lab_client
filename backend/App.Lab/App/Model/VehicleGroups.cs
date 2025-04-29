
namespace App.Lab.App.Model
{

    /// <summary>Nhóm phương tiện</summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class VehicleGroups
    {

        /// <summary>identifier Id nhóm phương tiện</summary>
        public int PK_VehicleGroupID { get; set; }

        /// <summary>Id công ty</summary>
        public int? FK_CompanyID { get; set; }

        /// <summary>Id nhóm phương tiện cha</summary>
        public int? ParentVehicleGroupId { get; set; }

        /// <summary>Tên</summary>
        public string Name { get; set; }

        /// <summary>Trạng thái xóa hay không?</summary>
        public virtual bool? IsDeleted { get; set; }

        /// <summary>Trạng thái hoạt động hay không?</summary>
        public bool? Status { get; set; }

        /// <summary>Nhóm con</summary>
        public List<VehicleGroups>? GroupsChild { get; set; }

        /// <summary>Cấp: 1, 2, 3</summary>
        public int? Level { get; set; }

        /// <summary>Có nhóm con hay không</summary>
        public bool? HasChild { get; set; }

        /// <summary>Có ẩn nhóm con hay không? để view ở frontend</summary>
        public bool? IsHideChildren { get; set; } = false;

        /// <summary>Trạng thái ẩn nhóm</summary>
        public bool? IsHide { get; set; }
    }


    /// <summary>Bộ lọc nhóm phương tiện</summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class VehicleGroupsFilter
    {
        /// <summary>identifier Id nhóm phương tiện</summary>
        public int? PK_VehicleGroupID { get; set; }

        /// <summary>Id User </summary>
        public string PK_UserID { get; set; }

        /// <summary>Id công ty</summary>
        public int? FK_CompanyID { get; set; }

        /// <summary>Id nhóm phương tiện cha</summary>
        public int? ParentVehicleGroupID { get; set; }

        /// <summary>Tên</summary>
        public string Name { get; set; }

        /// <summary>Trạng thái xóa hay không?</summary>
        public bool? IsDeleted { get; set; }

        /// <summary>Trạng thái hoạt động hay không?</summary>
        public bool? Status { get; set; }
    }
}
