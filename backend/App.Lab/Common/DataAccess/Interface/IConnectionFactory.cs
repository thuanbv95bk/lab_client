using System.Data;

namespace App.DataAccess
{
    public interface IConnectionFactory
    {
        string GetConnectionString();

        string GetProviderName();

        IDbConnection Create();
    }
}
