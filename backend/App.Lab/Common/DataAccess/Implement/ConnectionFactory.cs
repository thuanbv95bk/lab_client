

using System.Data;
using System.Data.Common;
using App.Common.Helper;
using Microsoft.IdentityModel.Tokens;

namespace App.DataAccess
{
    public class ConnectionFactory : IConnectionFactory
    {
        private readonly DbProviderFactory _provider;

        private readonly string _connectionString;

        private readonly string _providerName;

        /// <summary>Initializes a new instance</summary>
        /// <param name="connectionName">connectionString</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public ConnectionFactory(string connectionName = null)
        {
            if (string.IsNullOrEmpty(connectionName))
            {
                connectionName = AppConfig.DefaultConnectionName;
            }

            _connectionString = AppConfig.GetConnectionString(connectionName);
            _providerName = AppConfig.GetProviderName(connectionName);
            _provider = DbProviderFactories.GetFactory(_providerName);
        }

        /// <summary>Initializes a new instance of the <see cref="ConnectionFactory" /> class.</summary>
        /// <param name="serverName">Name of the server.</param>
        /// <param name="db">The database.</param>
        /// <param name="login">The login.</param>
        /// <param name="password">The password.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        //public ConnectionFactory(string serverName, string db, string login, string password)
        //{
        //    if (CollectionUtilities.IsNullOrEmpty<char>((IEnumerable<char>)db))
        //    {
        //        db = "master";
        //    }

        //    _connectionString = $"Data Source={serverName};Initial Catalog={db};User ID={login};Password={password};";
        //    _providerName = "System.Data.SqlClient";
        //    _provider = DbProviderFactories.GetFactory(_providerName);
        //}

        /// <summary>Creates this instance.</summary>
        /// <exception cref="System.Exception">Failed to create a connection</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public IDbConnection Create()
        {
            DbConnection dbConnection = _provider.CreateConnection() ?? throw new Exception("Failed to create a connection");
            dbConnection.ConnectionString = _connectionString;
            dbConnection.Open();
            return dbConnection;
        }


        /// <summary>Gets the connection string.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public string GetConnectionString()
        {
            return _connectionString;
        }

        /// <summary>Gets the name of the provider.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public string GetProviderName()
        {
            return _providerName;
        }
    }
}
