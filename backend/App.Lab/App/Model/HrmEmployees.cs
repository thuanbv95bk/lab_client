using App.Common.Models;
using System.ComponentModel.DataAnnotations;
using FluentValidation;

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
    public class HrmEmployeeValidator : AbstractValidator<HrmEmployees>
    {
        public HrmEmployeeValidator()
        {
            RuleFor(x => x.DisplayName)
              .Cascade(CascadeMode.Stop)
              .NotEmpty().WithMessage("DisplayName không được để trống")
              .MaximumLength(100).WithMessage("DisplayName tối đa 100 ký tự")
              .Must(x => x == null || (!x.Contains("<") && !x.Contains(">")))
                    .WithMessage("DisplayName không được chứa ký tự '<' hoặc '>'");

            RuleFor(x => x.Mobile)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Số điện thoại không được để trống")
                .MaximumLength(25).WithMessage("Mobile tối đa 25 ký tự")
                .Matches(@"^\d+$").WithMessage("Số điện thoại chỉ được chứa các ký tự số") //.Matches() để kiểm tra chuỗi có phải là số không
                .Length(10).WithMessage("Số điện thoại phải có 10 chữ số");


            RuleFor(x => x.DriverLicense)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("DriverLicense không được để trống")
                .MaximumLength(32).WithMessage("DriverLicense tối đa 32 ký tự");

            RuleFor(x => x.IssueLicenseDate)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Ngày cấp bằng lái bắt buộc phải nhập")
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Ngày cấp bằng lái phải nhỏ hơn ngày hiện tại");
            RuleFor(x => x.ExpireLicenseDate)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Ngày hết hạn bắt buộc phải nhập")
                .Must((employee, expireDate) =>
                    employee.IssueLicenseDate.HasValue && expireDate > employee.IssueLicenseDate
                ).WithMessage("Ngày hết hạn phải lớn hơn ngày cấp");

            RuleFor(x => x.IssueLicensePlace)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Nơi cấp bằng lái bắt buộc phải nhập")
                .MaximumLength(150).WithMessage("Nơi cấp bằng lái không được vượt quá 150 ký tự")
                .Must(x => x == null || (!x.Contains("<") && !x.Contains(">")))
                    .WithMessage("Nơi cấp bằng lái không được chứa ký tự '<' hoặc '>'");
            RuleFor(x => x.LicenseType)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Loại bằng lái xe bắt buộc phải chọn");
        }



        public class HrmEmployeesListValidator : AbstractValidator<List<HrmEmployees>>
        {
            public HrmEmployeesListValidator()
            {
                RuleForEach(x => x)
                    .SetValidator(new HrmEmployeeValidator());
            }
        }
    }
}
