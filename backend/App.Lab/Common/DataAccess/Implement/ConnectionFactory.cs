

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

        public ConnectionFactory(string serverName, string db, string login, string password)
        {
            if (CollectionUtilities.IsNullOrEmpty<char>((IEnumerable<char>)db))
            {
                db = "master";
            }

            _connectionString = $"Data Source={serverName};Initial Catalog={db};User ID={login};Password={password};";
            _providerName = "System.Data.SqlClient";
            _provider = DbProviderFactories.GetFactory(_providerName);
        }

        public IDbConnection Create()
        {
            DbConnection dbConnection = _provider.CreateConnection() ?? throw new Exception("Failed to create a connection");
            dbConnection.ConnectionString = _connectionString;
            dbConnection.Open();
            return dbConnection;
        }

        public string GetConnectionString()
        {
            return _connectionString;
        }

        public string GetProviderName()
        {
            return _providerName;
        }
    }
}
