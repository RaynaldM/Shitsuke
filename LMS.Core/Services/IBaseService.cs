using System;

namespace LMS.Core.Services
{
    public interface IBaseService:IDisposable
    {
        ILogger LogService { get; set; }
    }
}
