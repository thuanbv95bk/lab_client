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

        /// <summary>Initializes a new instance of the <see cref="DbContext" /> class.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public DbContext()
        {
            _connectionFactory = new ConnectionFactory();
            _connection = _connectionFactory.Create();
            _connectionString = _connectionFactory.GetConnectionString();
            _providerName = _connectionFactory.GetProviderName();
        }


        /// <summary>Initializes a new instance of the <see cref="DbContext" /> class.</summary>
        /// <param name="connectionFactory">The connection factory.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public DbContext(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
            _connection = _connectionFactory.Create();
            _connectionString = _connectionFactory.GetConnectionString();
            _providerName = _connectionFactory.GetProviderName();
        }


        /// <summary>Gets the connection string.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public string GetConnectionString()
        {
            return _connectionString;
        }


        /// <summary>Determines whether [is SQL server].</summary>
        /// <returns>
        ///   <c>true</c> if [is SQL server]; otherwise, <c>false</c>.</returns>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public bool IsSqlServer()
        {
            return _providerName == "System.Data.SqlClient";
        }


        /// <summary>Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void Dispose()
        {
            _connection?.Dispose();
        }
    }
}
