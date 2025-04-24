using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    /// <summary>dùng để lấy dữ liệu cho vào combobox chọn lái xe</summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class HrmEmployeesCbx
    {
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

        /// <summary>Có bị xóa hau không</summary>
        public bool? IsDeleted { get; set; }

        /// <summary>có bị xóa hay không</summary>
        public bool? IsLocked { get; set; }
    }
}
