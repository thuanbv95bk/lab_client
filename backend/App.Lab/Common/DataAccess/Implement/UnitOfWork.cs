using System.Data;

namespace App.DataAccess
{
    /// <summary>UnitOfWork</summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbContext _dbContext;
        private IDbTransaction _transaction;

        public UnitOfWork()
        {
            _dbContext = new DbContext(new ConnectionFactory());
        }

        public UnitOfWork(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>Begins the transaction.</summary>
        /// <exception cref="System.Exception">May not begin transaction twice.</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public IDbTransaction BeginTransaction()
        {
            if (_transaction != null)
                throw new Exception("May not begin transaction twice.");
            _transaction = _dbContext.Connection.BeginTransaction();
            return _transaction;
        }


        /// <summary>Gets the database context.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public DbContext GetDbContext()
        {
            return _dbContext;
        }

        /// <summary>Gets the transaction.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public IDbTransaction GetTransaction()
        {
            return _transaction;
        }

        /// <summary>Saves the changes.</summary>
        /// <exception cref="System.Exception">May not call save changes twice.</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void SaveChanges()
        {
            if (_transaction == null)
                throw new Exception("May not call save changes twice.");
            _transaction.Commit();
            _transaction.Dispose();
            _transaction = null;
        }

        /// <summary>Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void Dispose()
        {
            if (_transaction == null)
                return;
            _transaction.Rollback();
            _transaction.Dispose();
            _transaction = null;
            _dbContext.Dispose();
        }
    }
}
