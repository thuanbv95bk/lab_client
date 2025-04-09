using System.Data;

namespace App.DataAccess
{
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

        public IDbTransaction BeginTransaction()
        {
            if (_transaction != null)
                throw new Exception("May not begin transaction twice.");
            _transaction = _dbContext.Connection.BeginTransaction();
            return _transaction;
        }

        public DbContext GetDbContext()
        {
            return _dbContext;
        }

        public IDbTransaction GetTransaction()
        {
            return _transaction;
        }

        public void SaveChanges()
        {
            if (_transaction == null)
                throw new Exception("May not call save changes twice.");
            _transaction.Commit();
            _transaction.Dispose();
            _transaction = null;
        }

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
