using System;
using LMS.Core.Services;

namespace LMS.Services.Helpers
{
    public abstract class BaseServices<T> : IDisposable where T : class, new()
    {
        public ILogger LogService { get; set; }

        private readonly Lazy<T> _repo = new Lazy<T>(() => new T());

        protected T Repository
        {
            get
            {
                return _repo.Value;
            }
        }

        public virtual void Dispose() { }
    }
}
