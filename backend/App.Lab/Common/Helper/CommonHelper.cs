using System.Reflection;
using System.Text.RegularExpressions;
using System.Text;
namespace App.Common.Helper
{
    /// <summary> </summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class StringHepler
    {
        public static string RemoveDiacritics(string text)
        {
            // Chuẩn hóa chuỗi
            var normalizedString = text.Normalize(NormalizationForm.FormD);

            // Sử dụng regex để loại bỏ các dấu (NonSpacingMark)
            var regex = new Regex("[^a-zA-Z0-9 ]", RegexOptions.IgnoreCase);
            return regex.Replace(normalizedString, "");
        }
        public static string RemoveDiacriticsToUpper(string text)
        {
            return RemoveDiacritics(text).ToUpper();
        }
    }
}