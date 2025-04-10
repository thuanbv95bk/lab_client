
using System.Configuration;

namespace App.Common.Helper
{
    public static class AppConfig
    {
        //public static bool AlowHotUpdateConfig => ConfigurationManager.AppSettings["AlowHotUpdateConfig"] == "1";

        public static string DefaultConnectionName => ConfigurationManager.AppSettings["DefaultConnection"] ?? "SQLConnection";

        //public static bool SaveFileToDb => ConfigurationManager.AppSettings["SaveFileToDb"] == "1";

        //public static long MaxUploadFileSizeInMb => int.Parse(ConfigurationManager.AppSettings["MaxUploadFileSize"] ?? "5");

        //public static long MaxUploadFileSizeInByte => MaxUploadFileSizeInMb * 1024 * 1024;

        //public static List<string> LstExtAllowToUpload => (from x in ConfigurationManager.AppSettings["LstExtAllowToUpload"]?.Split(',')
        //                                                   where !string.IsNullOrEmpty(x)
        //                                                   select x).ToList() ?? new List<string>();

        //public static List<string> LstExtNotAllowToUpload => (from x in ConfigurationManager.AppSettings["LstExtNotAllowToUpload"]?.Split(',')
        //                                                      where !string.IsNullOrEmpty(x)
        //                                                      select x).ToList() ?? new List<string>();

        public static List<string> LstFrontEndUrl => (from x in ConfigurationManager.AppSettings["LstFrontEndUrl"]?.Split(',')
                                                      where !string.IsNullOrEmpty(x)
                                                      select x).ToList() ?? throw new Exception("Missing setting: LstFrontEndUrl");

        //public static bool MonitorInUse => ConfigurationManager.AppSettings["MonitorInUse"] == "1";

        //public static bool LogApiInUse => ConfigurationManager.AppSettings["LogApiInUse"] == "1";

        //public static string LogApiUrlRegex => ConfigurationManager.AppSettings["LogApiUrlRegex"] ?? ".";

        //public static bool NotifyInUse => ConfigurationManager.AppSettings["NotifyInUse"] == "1";

        //public static bool SwaggerInUse => ConfigurationManager.AppSettings["SwaggerInUse"] == "1";

        //public static bool HangfireInUse => ConfigurationManager.AppSettings["HangfireInUse"] == "1";

        //public static bool ImageResizeInUse => ConfigurationManager.AppSettings["ImageResizeInUse"] == "1";

        //public static List<string> LstImageExt => (from x in ConfigurationManager.AppSettings["ImageExtList"]?.Split(',')
        //                                           where !string.IsNullOrEmpty(x)
        //                                           select x).ToList() ?? new List<string> { ".png", ".jpg" };

        //public static int ImageMaxWidth => int.Parse(ConfigurationManager.AppSettings["ImageMaxWidth"] ?? "1000");

        //public static int ImageMaxHeight => int.Parse(ConfigurationManager.AppSettings["ImageMaxHeight"] ?? "1000");

        //public static bool FirebaseInUse => ConfigurationManager.AppSettings["FirebaseInUse"] == "1";

        //public static string FirebaseAuthFile => IsDecodeSetting("FirebaseAuthFile") ? GetDecodeSetting("FirebaseAuthFile") : ConfigurationManager.AppSettings["FirebaseAuthFile"];

        //public static string BasePath
        //{
        //    get
        //    {
        //        string text = (IsDecodeSetting("BASE_PATH") ? GetDecodeSetting("BASE_PATH") : ConfigurationManager.AppSettings["BASE_PATH"]);
        //        if (string.IsNullOrWhiteSpace(text))
        //        {
        //            return AppDomain.CurrentDomain.BaseDirectory;
        //        }

        //        if (!Directory.Exists(text))
        //        {
        //            Directory.CreateDirectory(text);
        //        }

        //        return text;
        //    }
        //}

        //public static string TemplatePath => Path.Combine(BasePath, ".TEMPLATE");

        //private static string DatePath
        //{
        //    get
        //    {
        //        DateTime now = DateTime.Now;
        //        return Path.Combine(now.Year.ToString(), now.Month.ToString().PadLeft(2, '0'), now.Day.ToString().PadLeft(2, '0'));
        //    }
        //}

        //public static string DataPath
        //{
        //    get
        //    {
        //        string text = Path.Combine(".DATA", DatePath);
        //        string path = Path.Combine(BasePath, text);
        //        if (!Directory.Exists(path))
        //        {
        //            Directory.CreateDirectory(path);
        //        }

        //        return text;
        //    }
        //}

        //public static string TemporaryPath
        //{
        //    get
        //    {
        //        string text = Path.Combine(".temp", DatePath);
        //        string path = Path.Combine(BasePath, text);
        //        if (!Directory.Exists(path))
        //        {
        //            Directory.CreateDirectory(path);
        //        }

        //        return text;
        //    }
        //}

        private static bool EncodeSettingInUse => ConfigurationManager.AppSettings["EncodeSettingInUse"] == "1";

        //public static List<string> LstSettingNeedEncoded => (from x in ConfigurationManager.AppSettings["LstSettingNeedEncoded"]?.Split(',')
        //                                                     where !string.IsNullOrEmpty(x)
        //                                                     select x).ToList() ?? new List<string>();

        public static List<string> LstSettingEncoded => (from x in ConfigurationManager.AppSettings["LstSettingEncoded"]?.Split(',')
                                                         where !string.IsNullOrEmpty(x)
                                                         select x).ToList() ?? new List<string>();

        public static string GetConnectionString(string connectionName)
        {
            //IL_0020: Unknown result type (might be due to invalid IL or missing references)
            ConnectionStringSettings val = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException("Failed to find connection string named '" + connectionName + "' in app/web.config.");
            if (IsDecodeSetting("connectionStrings"))
            {
                return EncryptHelper.Decode(val.ConnectionString);
            }

            return val.ConnectionString;
        }

        public static string GetProviderName(string connectionName)
        {
            //IL_0020: Unknown result type (might be due to invalid IL or missing references)
            ConnectionStringSettings val = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException("Failed to find connection string named '" + connectionName + "' in app/web.config.");
            return val.ProviderName;
        }

        //public static int TokenExpire()
        //{
        //    int result = 20;
        //    string text = (IsDecodeSetting("TOKEN_EXPIRE") ? GetDecodeSetting("TOKEN_EXPIRE") : ConfigurationManager.AppSettings["TOKEN_EXPIRE"]);
        //    if (text != null && int.TryParse(text, out result))
        //    {
        //        return result;
        //    }

        //    return result;
        //}

        //public static void EncodeSetting()
        //{
        //    //IL_005f: Unknown result type (might be due to invalid IL or missing references)
        //    //IL_0066: Expected O, but got Unknown
        //    if (!EncodeSettingInUse)
        //    {
        //        return;
        //    }

        //    Configuration val = ConfigurationManager.OpenExeConfiguration((ConfigurationUserLevel)0);
        //    foreach (string item in LstSettingNeedEncoded)
        //    {
        //        if (item == "ConnectionStrings")
        //        {
        //            foreach (ConnectionStringSettings item2 in (ConfigurationElementCollection)val.ConnectionStrings.ConnectionStrings)
        //            {
        //                ConnectionStringSettings val2 = item2;
        //                val2.ConnectionString = EncryptHelper.Encode(val2.ConnectionString);
        //            }
        //        }
        //        else
        //        {
        //            string text = ConfigurationManager.AppSettings[item];
        //            string value = EncryptHelper.Encode(text);
        //            val.AppSettings.Settings[item].Value = value;
        //        }
        //    }

        //    List<string> list = new List<string>();
        //    list.AddRange(LstSettingEncoded);
        //    list.AddRange(LstSettingNeedEncoded);
        //    val.AppSettings.Settings["LstSettingNeedEncoded"].Value = string.Empty;
        //    val.AppSettings.Settings["LstSettingEncoded"].Value = string.Join(',', list);
        //    val.Save((ConfigurationSaveMode)0);
        //    ConfigurationManager.RefreshSection("appSettings");
        //    ConfigurationManager.RefreshSection("connectionStrings");
        //}

        //private static string GetDecodeSetting(string key)
        //{
        //    string textEncoded = ConfigurationManager.AppSettings[key];
        //    return EncryptHelper.Decode(textEncoded);
        //}

        private static bool IsDecodeSetting(string key)
        {
            return EncodeSettingInUse && LstSettingEncoded.Contains(key);
        }
    }

}
