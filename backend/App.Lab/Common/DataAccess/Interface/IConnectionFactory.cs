using System.Data;

namespace App.DataAccess
{
    public interface IConnectionFactory
    {
        IDbConnection Create();
    }
}
