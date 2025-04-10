using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    public class Users
    {
        public string PK_UserID { get; set; }
        public int? FK_CompanyID { get; set; }
        public string Username { get; set; } 
        public string UserNameLower { get; set; }
        public string Password { get; set; }
        public string fullName { get; set; } 
        public bool? IsLock { get; set; }
        public DateTime? LastPasswordChanged { get; set; }
    
        public string CreatedByUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedByUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        //public byte? LockLevel { get; set; }
        public bool? IsDeleted { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CreatedIP { get; set; }
        public string? UpdatedIP { get; set; }
        public string? Email { get; set; }
        public string? AllowedAccessIP { get; set; }
        public bool? UseSecurityCodeSMS { get; set; }
        public string? UsernameBAP { get; set; }
        public string? LoginType { get; set; }
        public string SuperiorSaleID { get; set; }

        public bool? IsActived { get; set; }
        public DateTime? ActivedDate { get; set; }
        public bool? IsWeakPassword { get; set; }
        public DateTime? KeepWeakPasswordDate { get; set; }
    }


    public class UsersFilter
    {
        public string PK_UserID { get; set; }
        public int? FK_CompanyID { get; set; }
        public string Username { get; set; }
        public string UserNameLower { get; set; }
        public string Fullname { get; set; }
        public bool? IsLock { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActived { get; set; }
       
    }
}
