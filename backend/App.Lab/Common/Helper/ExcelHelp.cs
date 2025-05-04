
using System.Collections;
using System.Drawing;
using System.Reflection;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace App.Lab.Common.Helper
{
    /// <summary> Các hàm liên quan đến excel, dùng thư viện Epplus </summary>
    /// Author: thuanbv
    /// Created: 29/04/2025
    /// Modified: date - user - description
    public class ExcelHelp
    {
        /// <summary>Set định dạng số cho cell, ẩn số 0</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelNumberFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0_);_(* -#,##0_);_(* \" - \"_);_(@_)";
        }

        /// <summary>Set định dạng số cho cell với 1 số thập phân, ẩn số 0</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelNumberFormat1(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0.0_);_(* (#,##0.0);_(* \" - \"??_);_(@_)";
        }

        /// <summary>Set định dạng số cho cell với 2 số thập phân, ẩn số 0</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelNumberFormat2(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0.00_);_(* (#,##0.00);_(* \" - \"??_);_(@_)";
        }

        /// <summary>Set định dạng tiền USD cho cell với 2 số thập phân, không ẩn số 0</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelNumberFormatUsd2NotHide0(ExcelRange range)
        {
            range.Style.Numberformat.Format = "$ #,##0.00";
        }

        /// <summary>Set định dạng thời gian cho cell (giờ:phút)</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelTimeFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "hh:mm;@";
        }

        /// <summary>Set định dạng ngày tháng cho cell (dd/mm/yyyy)</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelDateFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "dd/mm/yyyy;@";
        }

        /// <summary>Set định dạng ngày giờ cho cell (HH:mm dd/MM/yyyy), có xuống dòng giữa giờ và ngày</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelDateTimeFormat(ExcelRange range)
        {
            // Định dạng ngày giờ với ký tự xuống dòng
            range.Style.Numberformat.Format = "HH:mm \n\\ dd/MM/yyyy";
        }

        /// <summary>Set định dạng phần trăm cho cell, không có số thập phân</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelPercentFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0%;-0%;\" \"";
        }

        /// <summary>Set định dạng phần trăm cho cell với 1 số thập phân</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelPercentFormat1(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0.0%;-0.0%;\" \"";
        }

        /// <summary>Set định dạng phần trăm cho cell với 2 số thập phân</summary>
        /// <param name="range">Cell cần định dạng</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetExcelPercentFormat2(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0.00%;-0.00%;\" \"";
        }

        /// <summary>Set kiểu định dạng dữ liệu của 1 ExcelRange</summary>
        /// <param name="cells">The cells.</param>
        /// <param name="exFormat">The ex format.</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void SetFormat(ExcelRange cells, ExportExcelConfigFormatType exFormat)
        {
            switch (exFormat)
            {
                case ExportExcelConfigFormatType.Text:
                    break;
                case ExportExcelConfigFormatType.Date:
                    ExcelHelp.SetExcelDateFormat(cells);
                    break;
                case ExportExcelConfigFormatType.DateTime:
                    ExcelHelp.SetExcelDateTimeFormat(cells);
                    break;
                case ExportExcelConfigFormatType.Time:
                    ExcelHelp.SetExcelTimeFormat(cells);
                    break;
                case ExportExcelConfigFormatType.Number:
                    ExcelHelp.SetExcelNumberFormat(cells);
                    break;
                case ExportExcelConfigFormatType.Number1:
                    ExcelHelp.SetExcelNumberFormat1(cells);
                    break;
                case ExportExcelConfigFormatType.Number2:
                    ExcelHelp.SetExcelNumberFormat2(cells);
                    break;
                default:
                    break;
            }
        }


        /// <summary>Cấu hình header cho file Excel</summary>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public class ExportExcelConfigHeader
        {
            /// <summary>Tiêu đề của cột</summary>
            public string Caption { get; set; }
            /// <summary>Số cột merge ngang</summary>
            public int ColSpan { get; set; }
            /// <summary>Số dòng merge dọc</summary>
            public int RowSpan { get; set; }
        }
        /// <summary>Cấu hình dòng dữ liệu cho file Excel</summary>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public class ExportExcelConfigRow
        {
            /// <summary>Định dạng của cột</summary>
            public ExportExcelConfigFormatType ColumnFormat { get; set; }
            /// <summary>Tên thuộc tính map với dữ liệu</summary>
            public string PropertyName { get; set; }
            /// <summary>Độ rộng của cột</summary>
            public int? Width { get; set; }
            /// <summary>Cho phép wrap text</summary>
            public bool? WrapText { get; set; }
        }

        /// <summary>Các kiểu định dạng dữ liệu khi xuất Excel</summary>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public enum ExportExcelConfigFormatType
        {
            /// <summary>Định dạng text thông thường</summary>
            Text = 0,

            /// <summary>Định dạng ngày tháng (dd/mm/yyyy)</summary>
            Date = 1,

            /// <summary>Định dạng ngày giờ (HH:mm dd/MM/yyyy) có xuống dòng giữa giờ và ngày</summary>
            DateTime = 2,

            /// <summary>Định dạng thời gian (hh:mm)</summary>
            Time = 3,

            /// <summary>Định dạng số (phân cách hàng nghìn, ẩn số 0)</summary>
            Number = 4,

            /// <summary>Định dạng số (phân cách hàng nghìn, 1 số thập phân, ẩn số 0)</summary>
            Number1 = 5,

            /// <summary>Định dạng số (phân cách hàng nghìn, 2 số thập phân, ẩn số 0)</summary>
            Number2 = 6,

            /// <summary>Định dạng ngày giờ dạng chuỗi (không convert)</summary>
            DateTimeString = 7,
        }

        /// <summary>Set border cho vùng cells</summary>
        /// <param name="ws">Worksheet cần xử lý</param>
        /// <param name="startRow">Dòng bắt đầu</param>
        /// <param name="startColumn">Cột bắt đầu</param>
        /// <param name="endRow">Dòng kết thúc</param>
        /// <param name="endColumn">Cột kết thúc</param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public static void ConvertBorderExcel(ExcelWorksheet ws, int startRow, int startColumn, int endRow, int endColumn)
        {
            var modelTable = ws.Cells[startRow, startColumn, endRow, endColumn];
            modelTable.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            modelTable.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            modelTable.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            modelTable.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            modelTable.Style.Font.Size = 12;
        }

    }
}
