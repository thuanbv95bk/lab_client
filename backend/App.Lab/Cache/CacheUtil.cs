
namespace App.Cache
{
    public static class CacheUtil
    {

        public static T Get<T>(string key)
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            return _cacheProvider.Get<T>(key);
        }

        public static void Set<T>(string key, T value)
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            _cacheProvider.Set(key, value);
        }

        public static void Set<T>(string key, T value, TimeSpan timeExpire)
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            _cacheProvider.Set(key, value, timeExpire);
        }

        public static void Remove(string key)
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            _cacheProvider.Remove(key);
        }

        public static void RemoveStarwith(string startwith)
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            _cacheProvider.RemoveStartWith(startwith);
        }

        public static void RemoveAll()
        {
            using ICacheProvider _cacheProvider = new RedisCacheProvider();
            _cacheProvider.ClearAll();
        }
    }
}

