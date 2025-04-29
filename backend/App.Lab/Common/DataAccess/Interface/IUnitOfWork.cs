using System.Data;

namespace App.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>Gets the database context.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        DbContext GetDbContext();

        /// <summary>Gets the transaction.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
   
        IDbTransaction GetTransaction();
        /// <summary>Begins the transaction.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        IDbTransaction BeginTransaction();

        /// <summary>Saves the changes.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        void SaveChanges();
    }
}
