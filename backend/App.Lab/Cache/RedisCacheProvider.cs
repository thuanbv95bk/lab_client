
using Newtonsoft.Json;
using StackExchange.Redis;

namespace App.Cache
{
    public class RedisCacheProvider :IDisposable
    {
        private static ConnectionMultiplexer redisConnections;

        //public RedisCacheProvider()
        //{
        //    if (redisConnections == null)
        //        RedisCacheProvider.redisConnections = ConnectionMultiplexer.Connect(RedisConfigurationManager.Config.Host + ":" + RedisConfigurationManager.Config.Port);
        //}

        //public void Set<T>(string key, T value)
        //{
        //    try
        //    {
        //        this.Set(key, value, TimeSpan.Zero);
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        //public void Set<T>(string key, T value, TimeSpan timeout)
        //{
        //    try
        //    {
        //        var db = RedisCacheProvider.redisConnections.GetDatabase(RedisConfigurationManager.Config.DatabaseID);
        //        db.StringSet(key, JsonConvert.SerializeObject(value
        //                    , Newtonsoft.Json.Formatting.Indented
        //                    , new JsonSerializerSettings
        //                    {
        //                        ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
        //                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
        //                    }));
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }

        //}

        //public T Get<T>(string key)
        //{
        //    try
        //    {
        //        T result = default(T);

        //        var db = RedisCacheProvider.redisConnections.GetDatabase(RedisConfigurationManager.Config.DatabaseID);
        //        var redisObject = db.StringGet(key);
        //        if (redisObject.HasValue)
        //        {
        //            return JsonConvert.DeserializeObject<T>(redisObject,
        //                new JsonSerializerSettings
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
        //                    PreserveReferencesHandling = PreserveReferencesHandling.Objects
        //                });
        //        }

        //        return result;
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        //public bool Remove(string key)
        //{
        //    try
        //    {
        //        var db = RedisCacheProvider.redisConnections.GetDatabase(RedisConfigurationManager.Config.DatabaseID);
        //        bool removed = db.KeyDelete(key);
        //        return removed;
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        //public bool RemoveStartWith(string startwith)
        //{
        //    try
        //    {
        //        string pattern = $"{startwith}*";
        //        var db = RedisCacheProvider.redisConnections.GetDatabase(RedisConfigurationManager.Config.DatabaseID);
        //        var keys = RedisCacheProvider.redisConnections.GetServer(RedisConfigurationManager.Config.Host, RedisConfigurationManager.Config.Port).Keys(pattern: pattern);
        //        //var keys = db.Multiplexer.GetServer(this.redisConnections.GetEndPoints()[0]).Keys(pattern: pattern);
        //        foreach (var key in keys)
        //        {
        //            db.KeyDelete(key);
        //        }

        //        return true;
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        //public bool IsInCache(string key)
        //{
        //    try
        //    {
        //        var db = RedisCacheProvider.redisConnections.GetDatabase(RedisConfigurationManager.Config.DatabaseID);
        //        bool isInCache = db.KeyExists(key);
        //        return isInCache;
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        //public void ClearAll()
        //{
        //    try
        //    {
        //        var server = RedisCacheProvider.redisConnections.GetServer(RedisConfigurationManager.Config.Host + ":" + RedisConfigurationManager.Config.Port);
        //        server.FlushDatabase(RedisConfigurationManager.Config.DatabaseID);
        //    }
        //    catch
        //    {
        //        RedisCacheProvider.redisConnections.Dispose();
        //        RedisCacheProvider.redisConnections = null;
        //        throw;
        //    }
        //}

        public void Dispose()
        {
            if (redisConnections != null)
                redisConnections.Dispose();
        }
    }
}

