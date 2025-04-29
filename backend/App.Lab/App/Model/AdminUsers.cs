using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    /// <summary> Danh sách User </summary>
    /// Author: thuanbv
    /// Created: 22/04/2025
    /// Modified: date - user - description
    public class Users
    {
        /// <summary>identifier Id của User</summary>
        public string PK_UserID { get; set; }

        /// <summary>Id của công ty</summary>
        public int? FK_CompanyID { get; set; }

        /// <summary>UserName </summary>
        public string UserName { get; set; }

        /// <summary>UserNameLower</summary>
        public string UserNameLower { get; set; }

        /// <summary>Họ tên</summary>
        public string FullName { get; set; }

        /// <summary>Trạng thái khóa hay không</summary>
        public bool? IsLock { get; set; }

        /// <summary>Trạng thái đã xóa hay không</summary>
        public bool? IsDeleted { get; set; }

        /// <summary>Địa chỉ Email</summary>
        public string? Email { get; set; }
        /// <summary>Trạng thái đã kích hoạt hay không</summary>
        public bool? IsActived { get; set; }
    }
}
