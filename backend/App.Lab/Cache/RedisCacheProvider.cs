
using Newtonsoft.Json;
using StackExchange.Redis;

namespace App.Cache
{
    public class RedisCacheProvider : IDisposable
    {
        private static ConnectionMultiplexer RedisConnections;

        /// <summary>Ngắt kết nối với DB</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void Dispose()
        {
            if (RedisConnections != null)
                RedisConnections.Dispose();
        }
    }
}

