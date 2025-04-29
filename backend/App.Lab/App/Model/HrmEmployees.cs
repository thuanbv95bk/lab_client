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
        /// <summary> Id lái xe</summary>
        public int pkEmployeeId { get; set; }

        /// <summary> Tên hiển thị</summary>
        public string DisplayName { get; set; }

        /// <summary> Giấy phép lái xe</summary>
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


    /// <summary>quản lý thông tin lái xe</summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class HrmEmployees
    {
        /// <summary>Khóa chính, ID của lái xe</summary>
        public int PkEmployeeId { get; set; }

        /// <summary>Tên hiển thị của lái xe</summary>
        [MaxLength(100)]
        public string DisplayName { get; set; }

        /// <summary>Số điện thoại di động</summary>
        [MaxLength(25)]
        public string Mobile { get; set; }

        /// <summary>Số giấy phép lái xe</summary>
        [MaxLength(32)]
        public string DriverLicense { get; set; }

        /// <summary>Ngày cấp giấy phép lái xe</summary>
        public DateTime? IssueLicenseDate { get; set; }

        /// <summary>Ngày hết hạn giấy phép lái xe</summary>
        public DateTime? ExpireLicenseDate { get; set; }

        /// <summary>Nơi cấp giấy phép lái xe</summary>
        [MaxLength(150)]
        public string IssueLicensePlace { get; set; }

        /// <summary>Loại bằng lái (ID)</summary>
        public string LicenseType { get; set; }

        /// <summary>Ngày cập nhật</summary>
        public DateTime? UpdatedDate { get; set; }

        /// <summary>Ngày tạo</summary>
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
    /// <summary> Bộ lọc danh sách lái xe, kèm PagingFilter </summary>
    /// Author: thuanbv
    /// Created: 25/04/2025 
    /// Modified: date - user - description
    public class HrmEmployeesFilterExcel 
    {
        /// <summary> Id Công ty</summary>
        public int FkCompanyId { get; set; }

        /// <summary> Tên hiển thị</summary>
        public string DisplayName { get; set; }

        /// <summary> Số giấy phép lái xe</summary>
        public string DriverLicense { get; set; }

        /// <summary> Danh sách Id của lái xe cần lấy ra </summary>
        public string ListStringEmployeesId { get; set; }

        /// <summary> Danh sách Tên của lái xe cần lấy ra </summary>
        public string ListStringEmployeesName { get; set; }

        /// <summary> Loại giấy phép lái xe </summary>
        public string ListStringLicenseTypesId { get; set; }

        /// <summary>Danh sách tên giấy phép lái xe </summary>
        public string ListStringLicenseTypesName { get; set; }

        public SearchOption option { get; set; }

    }
    /// <summary>Tùy chọn tìm kiếm với cặp khóa-giá trị</summary>
    /// Author: thuanbv
    /// Created: 29/04/2025
    /// Modified: date - user - description
    public class SearchOption
    {
        /// <summary>Khóa tìm kiếm</summary>
        public string Key { get; set; }

        /// <summary>Giá trị tìm kiếm</summary>
        public string Value { get; set; }
    }

    /// <summary>Validator kiểm tra dữ liệu cho đối tượng HrmEmployees</summary>
    /// Author: thuanbv
    /// Created: 29/04/2025
    /// Modified: date - user - description
    public class HrmEmployeeValidator : AbstractValidator<HrmEmployees>
    {
        /// <summary>Khởi tạo các rule kiểm tra dữ liệu</summary>
        public HrmEmployeeValidator()
        {
            RuleFor(x => x.DisplayName)
              .Cascade(CascadeMode.Stop)
              .NotEmpty().WithMessage("DisplayName không được để trống")
              .MaximumLength(100).WithMessage("DisplayName tối đa 100 ký tự")
              .Must(x => x == null || (!x.Contains("<") && !x.Contains(">")))
                    .WithMessage("DisplayName không được chứa ký tự '<' hoặc '>'");

            RuleFor(x => x.Mobile)
                .Matches(@"^\d+$")
                .WithMessage("Số điện thoại chỉ được chứa các ký tự số")
                .When(x => !string.IsNullOrEmpty(x.Mobile))
                .MaximumLength(25).WithMessage("Mobile tối đa 25 ký tự");

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

        /// <summary>Validator kiểm tra dữ liệu cho danh sách HrmEmployees</summary>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public class HrmEmployeesListValidator : AbstractValidator<List<HrmEmployees>>
        {
            /// <summary>Khởi tạo validator cho từng item trong danh sách</summary>
            public HrmEmployeesListValidator()
            {
                RuleForEach(x => x)
                    .SetValidator(new HrmEmployeeValidator());
            }
        }
    }
}
