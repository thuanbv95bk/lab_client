using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    public class CompanyCompanies
    {
        public int PK_CompanyID { get; set; }
        public int? ParentCompanyID { get; set; }
        public string? CompanyName { get; set; }
        public byte? CompanyType { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public DateTime? DateOfEstablishment { get; set; }
        public int? FK_ProviderID { get; set; }
        public string? LogoImagePath { get; set; }
        public int? XNCode { get; set; }
        public string? ListOfXNForPartner { get; set; }
        public bool? IsLocked { get; set; }
        public string? ReasonOfLocked { get; set; }
        public bool? IsDeleted { get; set; }
        public string? ReasonOfDeleted { get; set; }
        public bool? HasSimService { get; set; }
        public short? Flags { get; set; }
        public DateTime? StartLogfileTime { get; set; }
        public Guid CreatedByUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? UpdatedByUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? TaxCode { get; set; }
        public string? CustomerCode { get; set; }
        public int? SimServiceType { get; set; }
        public string? AccountantCode { get; set; }
        public bool? KCSChecked { get; set; }
        public DateTime? DateKCSChecked { get; set; }
        public Guid? UserKCSChecked { get; set; }
        public bool? IsTaxi { get; set; }
        public int? CcountLoginInMonth { get; set; }
        public bool? IsBlockXNCode { get; set; }
        public DateTime? UpdatedDateIsBlockXNCode { get; set; }
        public int? MonthOfSaveData { get; set; }
        public string? PrivateCompanyName { get; set; }
        public bool? IsAllowGoto { get; set; }
        public bool? IsBGTFforward { get; set; }
        public string? Description { get; set; }
    }
}
