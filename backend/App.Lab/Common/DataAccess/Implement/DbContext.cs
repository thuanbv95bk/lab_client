using System.Data;

namespace App.DataAccess
{
    public class DbContext : IDisposable
    {
        
        private readonly IDbConnection _connection;

        private readonly IConnectionFactory _connectionFactory;

        private readonly string _connectionString;

        private readonly string _providerName;

        public IDbConnection Connection => _connection;

        public DbContext()
        {
            _connectionFactory = new ConnectionFactory();
            _connection = _connectionFactory.Create();
            _connectionString = _connectionFactory.GetConnectionString();
            _providerName = _connectionFactory.GetProviderName();
        }

        public DbContext(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
            _connection = _connectionFactory.Create();
            _connectionString = _connectionFactory.GetConnectionString();
            _providerName = _connectionFactory.GetProviderName();
        }

        public string GetConnectionString()
        {
            return _connectionString;
        }

        public bool IsSqlServer()
        {
            return _providerName == "System.Data.SqlClient";
        }

        public bool IsOracle()
        {
            return _providerName == "System.Data.OracleClient";
        }

        public bool IsMySql()
        {
            return _providerName == "MySql.Data.MySqlClient";
        }

        public void Dispose()
        {
            _connection?.Dispose();
        }
    }
}
