using System.Data;

namespace App.DataAccess
{
    public class DbContext : IDisposable
    {
        private readonly IDbConnection _connection;
        private readonly IConnectionFactory _connectionFactory;

        public IDbConnection Connection
        {
            get { return _connection; }
        }

        public DbContext(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
            _connection = _connectionFactory.Create();
        }

        public void Dispose()
        {
            _connection?.Dispose();
        }
    }
}
