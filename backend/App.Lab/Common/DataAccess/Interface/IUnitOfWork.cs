using System.Data;

namespace App.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        DbContext GetDbContext();
        IDbTransaction GetTransaction();
        IDbTransaction BeginTransaction();
        void SaveChanges();
    }
}
