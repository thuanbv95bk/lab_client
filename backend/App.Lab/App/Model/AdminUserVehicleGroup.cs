using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Lab.App.Model;

namespace App.Lab.Model
{


    /// <summary>Nhóm phương tiện theo người dùng</summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class AdminUserVehicleGroup
    {
        /// <summary>Id của User</summary>
        public string FK_UserID { get; set; }

        /// <summary>Id Nhóm phương tiện</summary>
        public int FK_VehicleGroupID { get; set; }

        /// <summary>Id Nhóm cha</summary>
        public int? ParentVehicleGroupID { get; set; }

        /// <summary>Người tạo</summary>
        public string CreatedByUser { get; set; }

        /// <summary>Ngày tạo</summary>
        public DateTime? CreatedDate { get; set; }

        /// <summary>Người cập nhật</summary>
        public string UpdateByUser { get; set; }

        /// <summary>Ngày cập nhật</summary>
        public DateTime? UpdatedDate { get; set; }

        public string UpdatedByUser { get; set; }

        /// <summary>Trạng thái xóa</summary>
        public bool? IsDeleted { get; set; }
    }

    /// <summary>bộ lọc nhóm phương tiện đã gán</summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class AdminUserVehicleGroupFilter
    {
        /// <summary>Id của User</summary>
        public string FK_UserID { get; set; }

        /// <summary>Id Nhóm phương tiện</summary>
        public int? FK_VehicleGroupID { get; set; }

        /// <summary>Id Nhóm cha</summary>
        public int? ParentVehicleGroupID { get; set; }

        /// <summary>Trạng thái xóa</summary>
        public bool? IsDeleted { get; set; }
    }


    /// <summary> nhóm phương tiện theo người dùng- hiển thị view </summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class UserVehicleGroupView : VehicleGroups
    {
        /// <summary>Id của User</summary>
        public string PK_UserID { get; set; }

        /// <summary>Trạng thái xóa</summary>
        public override bool? IsDeleted { get; set; }
    }

    /// <summary>Class để thêm mới 1 nhóm phương tiện</summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class VehicleGroupModel
    {
        /// <summary>Id của User</summary>
        public string PK_UserID { get; set; }

        /// <summary>Danh sách nhóm phương tiện</summary>
        public List<UserVehicleGroupView> listGroup { get; set; }

    }

}
