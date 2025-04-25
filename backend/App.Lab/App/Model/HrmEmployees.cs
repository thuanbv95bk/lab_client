using App.Common.Models;
using System.ComponentModel.DataAnnotations;

namespace App.Lab.Model
{
    /// <summary>dùng để lấy dữ liệu cho vào combobox chọn lái xe</summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class HrmEmployeesCbx
    {
        public int pkEmployeeId { get; set; }
        public string DisplayName { get; set; }
        public string DriverLicense { get; set; }
    }

    /// <summary>dùng để filter dữ liệu cho vào combobox chọn lái xe</summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class HrmEmployeesFilterCbx
    {
        /// <summary>ID Công ty</summary>
        public int? FkCompanyID { get; set; }

        /// <summary>Có bị xóa hay không</summary>
        public bool? IsDeleted { get; set; }

        /// <summary>có bị xóa hay không</summary>
        public bool? IsLocked { get; set; }
    }

    public class HrmEmployees
    {
        public int PkEmployeeId { get; set; }

        [MaxLength(100)]
        public string DisplayName { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(25)]
        public string Mobile { get; set; }

        [MaxLength(32)]
        public string DriverLicense { get; set; }
        public DateTime? IssueLicenseDate { get; set; }
        public DateTime? ExpireLicenseDate { get; set; }

        [MaxLength(150)]
        public string IssueLicensePlace { get; set; }
        public int? LicenseType { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? CreatedDate { get; set; }
    }

    /// <summary> Bộ lọc danh sách lái xe, kèm PagingFilter </summary>
    /// Author: thuanbv
    /// Created: 25/04/2025 
    /// Modified: date - user - description
    public class HrmEmployeesFilter : PagingFilter
    {
        /// <summary> Id Công ty</summary>
        public int FkCompanyId { get; set; }

        /// <summary> Tên hiển thị</summary>
        public string DisplayName { get; set; }

        /// <summary> Số giấy phép lái xe</summary>
        public string DriverLicense { get; set; }

        /// <summary> Danh sách Id của lái xe cần lấy ra </summary>
        public string ListStringEmployeesId { get; set; }

        /// <summary> Loại giấy phép lái xe </summary>
        public string ListStringLicenseTypesId { get; set; }

        public SearchOption option { get; set; }

    }

    public class SearchOption
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

}
