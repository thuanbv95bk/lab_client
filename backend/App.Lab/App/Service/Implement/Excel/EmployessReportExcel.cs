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
using Microsoft.VisualStudio.Services.Common;
using System.Data.Common;


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
                            PropertyName="UpdatedDate",
                            WrapText =true
                        },
            };
        }

        public static void FillExcell(ExcelWorksheet ws, string title, List<Lab.Model.SearchOption> listFilter , int startRow, List<HrmEmployees> result = null, List<ExportExcelConfigRow> rows = null)
        {
            int currRowIdx = startRow;
            int currColIdx = 1;
            int currStartData;
            var listTitel = Title();
            var totalCols = listTitel.Count;

            // title
            ws.Cells[currRowIdx, currColIdx].Value = title;
            ws.Cells[currRowIdx, 1, 2, totalCols].Merge = true;
            ws.Cells[currRowIdx, 1].Style.Font.Bold = true;
            ws.Cells[currRowIdx, 1].Style.Font.Size = 20;
            ws.Cells[currRowIdx, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

            currRowIdx= currRowIdx+2;
            foreach (var item in listFilter)
            {
               
                ws.Cells[currRowIdx, 1].Value = string.Format("{0}: {1}", item.Key, item.Value);
                ws.Cells[currRowIdx, 1].Style.WrapText = true;
                ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Merge = true;
                ws.Cells[currRowIdx, 1].Style.Font.Size = 12;
                ws.Cells[currRowIdx, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                currRowIdx++;
            }

            //Cách 1 dòng trống
        
            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Merge = true;
            currRowIdx++;
            foreach (var headerRow in listTitel)
            {
               
                ws.Cells[currRowIdx, currColIdx].Value = headerRow;
                ws.Cells[currRowIdx, currColIdx].Style.Font.Bold = true;
                ws.Cells[currRowIdx, currColIdx].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                ws.Cells[currRowIdx, currColIdx].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
               
                currColIdx++;
            }
            ExcelHelp.ConvertBorderExcel(ws, currRowIdx, 1, currRowIdx, currColIdx - 1);
            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#84AEE0"));
            ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Style.Font.Size = 12;
            Type type = typeof(HrmEmployees);
            currRowIdx++;
            currStartData = currRowIdx;
            int index = 0;
            foreach (var item in result)
            {
                // giá trị stt
                index++;
                ws.Cells[currRowIdx, 1].Value = index;
                ws.Cells[currRowIdx, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                ws.Cells[currRowIdx, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                currColIdx = 2;
                foreach (var column in rows)
                {

                    PropertyInfo info = type.GetProperty(column.PropertyName) as PropertyInfo;
                   
                    ws.Cells[currRowIdx, currColIdx].Style.WrapText = column.WrapText.HasValue ? column.WrapText.Value : false;
                    if (column.ColumnFormat== ExportExcelConfigFormatType.DateTime)
                    {
                        ws.Cells[currRowIdx, currColIdx].Value = info.GetValue(item).ToString();
                        ExcelHelp.SetFormat(ws.Cells[currRowIdx, currColIdx], ExportExcelConfigFormatType.Text);
                    }
                    else
                    {
                        ws.Cells[currRowIdx, currColIdx].Value = info.GetValue(item);
                        ExcelHelp.SetFormat(ws.Cells[currRowIdx, currColIdx], column.ColumnFormat);
                    }

                        currColIdx++;
                }
                currRowIdx++;
            }
            currRowIdx++;

           
            // Assign borders
            ConvertBorderExcel(ws, currRowIdx - result.Count -1,  1, currRowIdx - 2, totalCols);

            ws.Cells[currStartData, 3, currRowIdx, totalCols].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[currStartData, 1, currRowIdx, totalCols].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            // autofit columns
            ws.Cells[1, 1, currRowIdx, totalCols].AutoFitColumns();
            // font
            ws.Cells[1, 1, currRowIdx - 1, totalCols].Style.Font.Name = "Times New Roman";

        }
    }
}
