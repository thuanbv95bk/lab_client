using System;
namespace App.Cache
{
    public interface ICacheProvider : IDisposable
    {
        void Set<T>(string key, T value);
        void Set<T>(string key, T value, TimeSpan timeout);
        T Get<T>(string key);
        bool Remove(string key);
        bool RemoveStartWith(string startwith);
        bool IsInCache(string key);
        void ClearAll();
    }
}

