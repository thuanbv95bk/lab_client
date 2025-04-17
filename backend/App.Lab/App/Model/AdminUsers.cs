using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{


    /// <summary>
    ///   <br />
    /// </summary>
    /// <Modified>
    /// Name       Date          Comments
    /// thuanbv  4/16/2025       Class Danh sách người dùng  
    /// </Modified>
    public class Users
    {
        public string PK_UserID { get; set; }
        public int? FK_CompanyID { get; set; }
        public string UserName { get; set; } 
        public string UserNameLower { get; set; }
        public string fullName { get; set; } 
        public bool? IsLock { get; set; }

        public bool? IsDeleted { get; set; }
        public string? Email { get; set; }
        public bool? IsActived { get; set; }
    }


    /// <summary>
    ///   <br />
    /// </summary>
    /// <Modified>
    /// Name       Date          Comments
    /// thuanbv   4/16/2025 	bộ lọc danh sách người dùng
    /// </Modified>
    public class UsersFilter
    {
        public string PK_UserID { get; set; }
        public int? FK_CompanyID { get; set; }
        public string userName { get; set; }
        public string userNameLower { get; set; }
        public string fullName { get; set; }
        public bool? isLock { get; set; }
        public bool? isDeleted { get; set; }
        public bool? isActived { get; set; }
       
    }
}
