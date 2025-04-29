using System.Data;

namespace App.DataAccess
{
    public interface IConnectionFactory
    {
        /// <summary>Gets the connection string.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        string GetConnectionString();

        /// <summary>Gets the name of the provider.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        string GetProviderName();

        /// <summary>Creates this instance.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        IDbConnection Create();
    }
}
