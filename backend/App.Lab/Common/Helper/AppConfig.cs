
using System.Configuration;

namespace App.Common.Helper
{
    public static class AppConfig
    {
        public static bool AlowHotUpdateConfig => ConfigurationManager.AppSettings["AlowHotUpdateConfig"] == "1";

        public static string GetConnectionString(string connectionName)
        {
            string connectionString;
            var ret = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException($"Failed to find connection string named '{connectionName}' in app/web.config.");
            if (IsDecodeSetting("connectionStrings"))
                connectionString = EncryptHelper.Decode(ret.ConnectionString);
            else
                connectionString = ret.ConnectionString;
            return connectionString;
        }

        public static string GetProviderName(string connectionName)
        {
            var ret = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException($"Failed to find connection string named '{connectionName}' in app/web.config.");
            return ret.ProviderName;
        }

        public static bool SaveFileToDb => ConfigurationManager.AppSettings["SaveFileToDb"] == "1";
        public static long MaxUploadFileSizeInMb => int.Parse(ConfigurationManager.AppSettings["MaxUploadFileSize"] ?? "5");
        public static long MaxUploadFileSizeInByte => MaxUploadFileSizeInMb * 1024 * 1024;

        public static List<string> LstExtAllowToUpload => ConfigurationManager.AppSettings["LstExtAllowToUpload"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string>();
        public static List<string> LstExtNotAllowToUpload => ConfigurationManager.AppSettings["LstExtNotAllowToUpload"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string>();

        public static List<string> LstFrontEndUrl => ConfigurationManager.AppSettings["LstFrontEndUrl"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? throw new Exception("Missing setting: LstFrontEndUrl");

        /// <summary>
        /// Token expire in minute (default value = 20)
        /// </summary>
        /// <returns></returns>
        public static int TokenExpire()
        {
            int ret = 20;
            var obj = IsDecodeSetting("TOKEN_EXPIRE") ? GetDecodeSetting("TOKEN_EXPIRE") : ConfigurationManager.AppSettings["TOKEN_EXPIRE"];
            if (obj != null)
            {
                if (int.TryParse(obj, out ret))
                    return ret;
            }
            return ret;
        }

        public static bool MonitorInUse => ConfigurationManager.AppSettings["MonitorInUse"] == "1";
        public static bool LogApiInUse => ConfigurationManager.AppSettings["LogApiInUse"] == "1";
        public static string LogApiUrlRegex => ConfigurationManager.AppSettings["LogApiUrlRegex"] ?? ".";

        public static bool NotifyInUse => ConfigurationManager.AppSettings["NotifyInUse"] == "1";
        public static bool SwaggerInUse => ConfigurationManager.AppSettings["SwaggerInUse"] == "1";
        public static bool HangfireInUse => ConfigurationManager.AppSettings["HangfireInUse"] == "1";

        public static bool ImageResizeInUse => ConfigurationManager.AppSettings["ImageResizeInUse"] == "1";
        public static List<string> LstImageExt => ConfigurationManager.AppSettings["ImageExtList"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string> { ".png", ".jpg" };
        public static int ImageMaxWidth => int.Parse(ConfigurationManager.AppSettings["ImageMaxWidth"] ?? "1000");
        public static int ImageMaxHeight => int.Parse(ConfigurationManager.AppSettings["ImageMaxHeight"] ?? "1000");

        public static bool FirebaseInUse => ConfigurationManager.AppSettings["FirebaseInUse"] == "1";
        public static string FirebaseAuthFile => IsDecodeSetting("FirebaseAuthFile") ? GetDecodeSetting("FirebaseAuthFile") : ConfigurationManager.AppSettings["FirebaseAuthFile"];

        public static string BasePath
        {
            get
            {
                var basePath = IsDecodeSetting("BASE_PATH") ? GetDecodeSetting("BASE_PATH") : ConfigurationManager.AppSettings["BASE_PATH"];
                if (string.IsNullOrWhiteSpace(basePath))
                    return AppDomain.CurrentDomain.BaseDirectory;

                if (!Directory.Exists(basePath))
                    Directory.CreateDirectory(basePath);
                return basePath;
            }
        }

        public static string TemplatePath => Path.Combine(BasePath, ".TEMPLATE");

        private static string DatePath
        {
            get
            {
                var now = DateTime.Now;
                var datePath = Path.Combine(now.Year.ToString(), now.Month.ToString().PadLeft(2, '0'), now.Day.ToString().PadLeft(2, '0'));
                return datePath;
            }
        }

        public static string DataPath
        {
            get
            {
                var dataPath = Path.Combine(".DATA", DatePath);
                var fullPath = Path.Combine(BasePath, dataPath);
                if (!Directory.Exists(fullPath))
                    Directory.CreateDirectory(fullPath);
                return dataPath;
            }
        }

        public static string TemporaryPath
        {
            get
            {
                var temporaryPath = Path.Combine(".temp", DatePath);
                var fullPath = Path.Combine(BasePath, temporaryPath);
                if (!Directory.Exists(fullPath))
                    Directory.CreateDirectory(fullPath);
                return temporaryPath;
            }
        }

        private static bool EncodeSettingInUse => ConfigurationManager.AppSettings["EncodeSettingInUse"] == "1";
        public static List<string> LstSettingNeedEncoded => ConfigurationManager.AppSettings["LstSettingNeedEncoded"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string>();
        public static List<string> LstSettingEncoded => ConfigurationManager.AppSettings["LstSettingEncoded"]?.Split(',').Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string>();

        public static void EncodeSetting()
        {
            if (EncodeSettingInUse)
            {
                Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

                foreach (var key in LstSettingNeedEncoded)
                {
                    if (key == "ConnectionStrings")
                    {
                        foreach (ConnectionStringSettings connectionString in config.ConnectionStrings.ConnectionStrings)
                        {
                            connectionString.ConnectionString = EncryptHelper.Encode(connectionString.ConnectionString);
                        }
                    }
                    else
                    {
                        var value = ConfigurationManager.AppSettings[key];
                        var valueEncode = EncryptHelper.Encode(value);
                        config.AppSettings.Settings[key].Value = valueEncode;
                    }
                }

                var encodedSetting = new List<string>();
                encodedSetting.AddRange(LstSettingEncoded);
                encodedSetting.AddRange(LstSettingNeedEncoded);

                config.AppSettings.Settings["LstSettingNeedEncoded"].Value = string.Empty;
                config.AppSettings.Settings["LstSettingEncoded"].Value = string.Join(',', encodedSetting);

                config.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection("appSettings");
                ConfigurationManager.RefreshSection("connectionStrings");
            }
        }

        private static string GetDecodeSetting(string key)
        {
            var valueEncoded = ConfigurationManager.AppSettings[key];
            var value = EncryptHelper.Decode(valueEncoded);
            return value;
        }

        private static bool IsDecodeSetting(string key)
        {
            return EncodeSettingInUse && LstSettingEncoded.Contains(key);
        }
    }
}
