
using System.Configuration;

namespace App.Common.Helper
{
    public static class AppConfig
    {

        public static string DefaultConnectionName => ConfigurationManager.AppSettings["DefaultConnection"] ?? "SQLConnection";


        public static List<string> LstFrontEndUrl => (from x in ConfigurationManager.AppSettings["LstFrontEndUrl"]?.Split(',')
                                                      where !string.IsNullOrEmpty(x)
                                                      select x).ToList() ?? throw new Exception("Missing setting: LstFrontEndUrl");

        private static bool EncodeSettingInUse => ConfigurationManager.AppSettings["EncodeSettingInUse"] == "1";

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


        private static bool IsDecodeSetting(string key)
        {
            return EncodeSettingInUse && LstSettingEncoded.Contains(key);
        }
    }

}
