
using System.Collections;
using System.Drawing;
using System.Reflection;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace App.Lab.Common.Helper
{
    public class ExcelHelp
    {
        public static void SetExcelNumberFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0_);_(* -#,##0_);_(* \" - \"_);_(@_)";

            // range.Style.Numberformat.Format = "_(* #,##0_);_(* (#,##0);_(* \" - \"_);_(@_)";
        }

        public static void SetExcelNumberFormat1(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0.0_);_(* (#,##0.0);_(* \" - \"??_);_(@_)";
        }

        public static void SetExcelNumberFormat2(ExcelRange range)
        {
            range.Style.Numberformat.Format = "_(* #,##0.00_);_(* (#,##0.00);_(* \" - \"??_);_(@_)";
            //range.Style.Numberformat.Format = "#,##0";
        }

        public static void SetExcelNumberFormatUsd2NotHide0(ExcelRange range)
        {
            range.Style.Numberformat.Format = "$ #,##0.00";
        }

        public static void SetExcelNumberFormatNotHide0(ExcelRange range)
        {
            range.Style.Numberformat.Format = "#,##0_);(#,##0)";
        }

        public static void SetExcelNumberFormat2NotHide0(ExcelRange range)
        {
            range.Style.Numberformat.Format = "#,##0.00";
        }

        // 0.00%
        public static void SetExcelTimeFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "hh:mm;@";
        }

        public static void SetExcelDateFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "dd/mm/yyyy;@";
        }

        public static void SetExcelDateTimeFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "hh:mm dd/MM/yyyy;@";
        }

        public static string GetExcelDateTimeRangeTitle(DateTime from, DateTime to)
        {
            var res = "";

            var dayOfWeekVietnamese = new Hashtable();
            dayOfWeekVietnamese.Add("Monday", "Thứ 2");
            dayOfWeekVietnamese.Add("Tuesday", "Thứ 3");
            dayOfWeekVietnamese.Add("Wednesday", "Thứ 4");
            dayOfWeekVietnamese.Add("Thursday", "Thứ 5");
            dayOfWeekVietnamese.Add("Friday", "Thứ 6");
            dayOfWeekVietnamese.Add("Saturday", "Thứ 7");
            dayOfWeekVietnamese.Add("Sunday", "Chủ nhật");

            var title = "Từ {0} ngày {1} đến {2} ngày {3}";
            res = string.Format(title, dayOfWeekVietnamese[from.DayOfWeek.ToString()], from.ToString("dd/MM/yyyy"), dayOfWeekVietnamese[to.DayOfWeek.ToString()], to.ToString("dd/MM/yyyy"));

            return res;
        }

        public static string GetVietnameseDayOfWeek(DateTime date, bool returnName = true)
        {
            var dayOfWeekVietnamese1 = new Hashtable();
            dayOfWeekVietnamese1.Add("Monday", "Thứ 2");
            dayOfWeekVietnamese1.Add("Tuesday", "Thứ 3");
            dayOfWeekVietnamese1.Add("Wednesday", "Thứ 4");
            dayOfWeekVietnamese1.Add("Thursday", "Thứ 5");
            dayOfWeekVietnamese1.Add("Friday", "Thứ 6");
            dayOfWeekVietnamese1.Add("Saturday", "Thứ 7");
            dayOfWeekVietnamese1.Add("Sunday", "Chủ nhật");

            var dayOfWeekVietnamese2 = new Hashtable();
            dayOfWeekVietnamese2.Add("Monday", "Thứ hai");
            dayOfWeekVietnamese2.Add("Tuesday", "Thứ ba");
            dayOfWeekVietnamese2.Add("Wednesday", "Thứ tư");
            dayOfWeekVietnamese2.Add("Thursday", "Thứ năm");
            dayOfWeekVietnamese2.Add("Friday", "Thứ sáu");
            dayOfWeekVietnamese2.Add("Saturday", "Thứ bảy");
            dayOfWeekVietnamese2.Add("Sunday", "Chủ nhật");

            return returnName ? dayOfWeekVietnamese2[date.DayOfWeek.ToString()].ToString() : dayOfWeekVietnamese1[date.DayOfWeek.ToString()].ToString();
        }

        public static void SetExcelPercentFormat(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0%;-0%;\" \"";
        }
        public static void SetExcelPercentFormat1(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0.0%;-0.0%;\" \"";
        }

        public static void SetExcelPercentFormat2(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0.00%;-0.00%;\" \"";
        }

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

        public class ExportExcelConfig<T>
        {
            private ExcelWorksheet _ws;
            private int _startRow;
            private string _title;
            private List<ExportExcelConfigHeader[]> _header;
            private List<ExportExcelConfigRow> _row;
            private IEnumerable<T> _data;
            private bool _showRowNumber;
            private string _headerFillHexColor;



            public ExportExcelConfig(ExcelWorksheet ws, string title, int startRow, List<ExportExcelConfigHeader[]> header, List<ExportExcelConfigRow> row
                , IEnumerable<T> data, bool showRowNumber = false, string headerFillHexColor = null)
            {
                _ws = ws;
                _header = header;
                _row = row;
                _startRow = startRow;
                _data = data;
                _title = title;
                _showRowNumber = showRowNumber;
                _headerFillHexColor = headerFillHexColor;
            }

            public void FillExcell()
            {
                int currRowIdx = 1, currColIdx = 1;
                var totalCols = _showRowNumber ? _row.Count + 1 : _row.Count;

                // title
                _ws.Cells[currRowIdx, 1].Value = _title;
                _ws.Cells[currRowIdx, 1, currRowIdx, totalCols].Merge = true;
                _ws.Cells[currRowIdx, 1].Style.Font.Bold = true;
                _ws.Cells[currRowIdx, 1].Style.Font.Size = 16;
                _ws.Cells[currRowIdx, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                currRowIdx = _startRow;

                // hiển thị số thứ tự
                if (_showRowNumber)
                {
                    _ws.Cells[currRowIdx, 1].Value = "#";
                    _ws.Cells[currRowIdx, 1, currRowIdx + _header.Count - 1, 1].Merge = true;
                }

                // danh sách cells đã merge
                var headerMergedCells = new List<Tuple<int, int>>();
                foreach (var headerRow in _header)
                {
                    currColIdx = _showRowNumber ? 2 : 1;
                    foreach (var headerCell in headerRow)
                    {
                        // tìm ô tiếp theo không bị merge của dòng này
                        while (headerMergedCells.Any(x => x.Item1 == currRowIdx && x.Item2 == currColIdx) && currColIdx <= totalCols)
                        {
                            currColIdx++;
                        }

                        _ws.Cells[currRowIdx, currColIdx].Value = headerCell.Caption;

                        // merge cột
                        if (headerCell.ColSpan > 1)
                        {
                            _ws.Cells[currRowIdx, currColIdx, currRowIdx, currColIdx + headerCell.ColSpan - 1].Merge = true;
                            // thêm vào ds ô đã merge
                            for (int i = currColIdx + 1; i <= currColIdx + headerCell.ColSpan - 1; i++)
                            {
                                headerMergedCells.Add(new Tuple<int, int>(currRowIdx, i));
                            }
                        }

                        // merge dòng
                        if (headerCell.RowSpan > 1)
                        {
                            _ws.Cells[currRowIdx, currColIdx, currRowIdx + headerCell.RowSpan - 1, currColIdx].Merge = true;
                            // thêm vào ds ô đã merge
                            for (int i = currRowIdx + 1; i <= currRowIdx + headerCell.RowSpan - 1; i++)
                            {
                                headerMergedCells.Add(new Tuple<int, int>(i, currColIdx));
                            }
                        }
                        currColIdx++;
                    }
                    currRowIdx++;
                }
                // header
                var headerCells = _ws.Cells[_startRow, 1, currRowIdx - 1, totalCols];
                headerCells.Style.Font.Bold = true;
                headerCells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                headerCells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                if (!string.IsNullOrWhiteSpace(_headerFillHexColor))
                {
                    headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    headerCells.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(_headerFillHexColor));
                }

                // dữ liệu
                int rowNumber = 1;
                Type type = typeof(T);
                foreach (var item in _data)
                {
                    currColIdx = _showRowNumber ? 2 : 1;
                    if (_showRowNumber)
                    {
                        _ws.Cells[currRowIdx, 1].Value = rowNumber;
                    }
                    foreach (var column in _row)
                    {
                        PropertyInfo info = type.GetProperty(column.PropertyName) as PropertyInfo;
                        _ws.Cells[currRowIdx, currColIdx].Value = info.GetValue(item);
                        SetFormat(_ws.Cells[currRowIdx, currColIdx], column.ColumnFormat);
                        _ws.Cells[currRowIdx, currColIdx].Style.WrapText = column.WrapText.HasValue ? column.WrapText.Value : false;
                        currColIdx++;
                    }
                    rowNumber++;
                    currRowIdx++;
                }

                // Assign borders
                var modelTable = _ws.Cells[_startRow, 1, currRowIdx - 1, totalCols];
                modelTable.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                modelTable.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                modelTable.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                modelTable.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                modelTable.Style.Font.Size = 12;

                // autofit columns
                _ws.Cells[_startRow, 1, currRowIdx, totalCols].AutoFitColumns();

                // column width
                if (_row != null && _row.Count > 0)
                {
                    currColIdx = _showRowNumber ? 2 : 1;
                    foreach (var r in _row)
                    {
                        if (r.Width.HasValue)
                        {
                            _ws.Column(currColIdx).Width = r.Width.Value;
                        }
                        currColIdx++;
                    }
                }

                // font
                _ws.Cells[1, 1, currRowIdx - 1, totalCols].Style.Font.Name = "Times New Roman";
            }

            private void SetFormat(ExcelRange cells, ExportExcelConfigFormatType exFormat)
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
        }

        public class ExportExcelConfigHeader
        {
            public string Caption { get; set; }
            public int ColSpan { get; set; }
            public int RowSpan { get; set; }
        }

        public class ExportExcelConfigRow
        {
            public ExportExcelConfigFormatType ColumnFormat { get; set; }
            public string PropertyName { get; set; }
            public int? Width { get; set; }
            public bool? WrapText { get; set; }
        }

        public enum ExportExcelConfigFormatType
        {
            Text = 0,
            Date = 1,
            DateTime = 2,
            Time = 3,
            Number = 4,
            Number1 = 5,
            Number2 = 6
        }

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
