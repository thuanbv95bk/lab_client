

using System.Data;
using System.Data.Common;
using App.Common.Helper;

namespace App.DataAccess
{
    public class ConnectionFactory : IConnectionFactory
    {
        private readonly DbProviderFactory _provider;
        private readonly string _connectionString;

        public ConnectionFactory(string connectionName = "SQLConnection")
        {
            if (string.IsNullOrEmpty(connectionName))
                throw new ArgumentNullException(nameof(connectionName));

            var conStr = AppConfig.GetConnectionString(connectionName);
            var providerName = AppConfig.GetProviderName(connectionName);

            _connectionString = conStr;
            _provider = DbProviderFactories.GetFactory(providerName);
        }

        public IDbConnection Create()
        {
            var connection = _provider.CreateConnection() ?? throw new Exception("Failed to create a connection");
            connection.ConnectionString = _connectionString;
            connection.Open();
            return connection;
        }

        public string GetConnectionString()
        {
            return _connectionString;
        }
    }
}
