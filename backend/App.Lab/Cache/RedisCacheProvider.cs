
using Newtonsoft.Json;
using StackExchange.Redis;

namespace App.Cache
{
    public class RedisCacheProvider :IDisposable
    {
        private static ConnectionMultiplexer RedisConnections;
        // ngắt kết nối DB
        public void Dispose()
        {
            if (RedisConnections != null)
                RedisConnections.Dispose();
        }
    }
}

