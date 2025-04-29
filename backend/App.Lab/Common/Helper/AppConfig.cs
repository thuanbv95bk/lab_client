
using System.Configuration;

namespace App.Common.Helper
{
    /// <summary> get config by appSetting.json</summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public static class AppConfig
    {

        /// <summary>Gets the default name of the connection.</summary>
        /// <value>The default name of the connection.</value>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static string DefaultConnectionName => ConfigurationManager.AppSettings["DefaultConnection"] ?? "SQLConnection";


        /// <summary>Gets the LST front end URL.</summary>
        /// <value>The LST front end URL.</value>
        /// <exception cref="System.Exception">Missing setting: LstFrontEndUrl</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static List<string> LstFrontEndUrl => (from x in ConfigurationManager.AppSettings["LstFrontEndUrl"]?.Split(',')
                                                      where !string.IsNullOrEmpty(x)
                                                      select x).ToList() ?? throw new Exception("Missing setting: LstFrontEndUrl");

        /// <summary>Gets the connection string.</summary>
        /// <param name="connectionName">Name of the connection.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static string GetConnectionString(string connectionName)
        {
            ConnectionStringSettings val = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException("Failed to find connection string named '" + connectionName + "' in app/web.config.");

            return val.ConnectionString;
        }

        /// <summary>Gets the name of the provider.</summary>
        /// <param name="connectionName">Name of the connection.</param>
        /// <exception cref="System.Configuration.ConfigurationErrorsException">Failed to find connection string named '" + connectionName + "' in app/web.config.</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static string GetProviderName(string connectionName)
        {

            ConnectionStringSettings val = ConfigurationManager.ConnectionStrings[connectionName] ?? throw new ConfigurationErrorsException("Failed to find connection string named '" + connectionName + "' in app/web.config.");
            return val.ProviderName;
        }

    }

}
