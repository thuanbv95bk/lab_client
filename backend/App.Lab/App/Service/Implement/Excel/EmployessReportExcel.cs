using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using static App.Lab.Common.Helper.ExcelHelp;
using App.Lab.Model;
using App.Lab.Common.Helper;


namespace App.Lab.App.Service.Implement
{
    public static class EmployessReportExcel
    {
        public static List<string> Title()
        {
            var lstTitle = new List<string>();

            lstTitle.Add("STT");
            lstTitle.Add("Họ và tên");
            lstTitle.Add("Số điện thoại");
            lstTitle.Add("Số giấy phép lái xe");
            lstTitle.Add("Ngày cấp");
            lstTitle.Add("Ngày hết hạn");
            lstTitle.Add("Nơi cấp");
            lstTitle.Add("Loại bằng");
            lstTitle.Add("Ngày cập nhật");
   
            return lstTitle;
        }
        public static List<ExportExcelConfigRow> HeaderRows()
        {
            return new List<ExportExcelConfigRow>()
                    {
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Text,
                            PropertyName="DisplayName"
                        },

                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Text,
                            PropertyName="Mobile"
                        },
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Text,
                            PropertyName="DriverLicense"
                        },

                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Date,
                            PropertyName="IssueLicenseDate"
                        },
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Date,
                            PropertyName="ExpireLicenseDate"
                        },
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Date,
                            PropertyName="IssueLicensePlace"
                        },
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.Text,
                            PropertyName="LicenseType"
                        },
                        new ExportExcelConfigRow()
                        {
                            ColumnFormat=ExportExcelConfigFormatType.DateTime,
                            PropertyName="UpdatedDate"
                        },
                        
                    };
        }

        public static void FillExcell(ExcelWorksheet ws, string title, string subTitle, int startRow, List<HrmEmployees> result = null, List<ExportExcelConfigRow> rows = null)
        {
            int currRowIdx = 1, currColIdx = 1;
            var listTitel = Title();
            var totalCols = listTitel.Count;

            // title
            ws.Cells[currRowIdx, currColIdx].Value = title;
            ws.Cells[currRowIdx, 1, 2, totalCols].Merge = true;
            ws.Cells[currRowIdx, 1].Style.Font.Bold = true;
            ws.Cells[currRowIdx, 1].Style.Font.Size = 20;
            ws.Cells[currRowIdx, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

            //subTitle
            ws.Cells[currRowIdx + 2, 1].Value = subTitle;
            ws.Cells[currRowIdx + 2, 1, currRowIdx + 2, totalCols].Merge = true;
            ws.Cells[currRowIdx + 2, 1].Style.Font.Size = 12;
            ws.Cells[currRowIdx + 2, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

            currRowIdx = startRow;

            foreach (var headerRow in listTitel)
            {

                ws.Cells[currRowIdx, currColIdx].Value = headerRow;
                ws.Cells[currRowIdx, currColIdx].Style.Font.Bold = true;
                ws.Cells[currRowIdx, currColIdx].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                ws.Cells[currRowIdx, currColIdx].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                // ws.Cells[currRowIdx, currColIdx].Style.Fill.PatternType = ExcelFillStyle.Solid;
                // currRowIdx++;
                currColIdx++;
            }
            ExcelHelp.ConvertBorderExcel(ws, currRowIdx, 1, currRowIdx, currColIdx - 1);

            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#DBDBDB"));


            Type type = typeof(HrmEmployees);
            currRowIdx++;

            int index = 0;
            foreach (var item in result)
            {
                // giá trị stt
                index++;
                ws.Cells[currRowIdx, 1].Value = index;
                currColIdx = 2;
                foreach (var column in rows)
                {

                    PropertyInfo info = type.GetProperty(column.PropertyName) as PropertyInfo;

                    ws.Cells[currRowIdx, currColIdx].Value = info.GetValue(item);

                    ExcelHelp.SetFormat(ws.Cells[currRowIdx, currColIdx], column.ColumnFormat);
                    ws.Cells[currRowIdx, currColIdx].Style.WrapText = column.WrapText.HasValue ? column.WrapText.Value : false;
                    currColIdx++;

                }
                currRowIdx++;
            }
            currRowIdx++;

            // Assign borders
            ConvertBorderExcel(ws, currRowIdx - result.Count -1,  1, currRowIdx - 2, totalCols);
            // autofit columns
            ws.Cells[startRow, 1, currRowIdx, totalCols].AutoFitColumns();


            // font
            ws.Cells[1, 1, currRowIdx - 1, totalCols].Style.Font.Name = "Times New Roman";


        }
    }
}
