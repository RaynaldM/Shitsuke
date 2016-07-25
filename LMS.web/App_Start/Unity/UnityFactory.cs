using LMS.Core.Services;
using Microsoft.Practices.Unity;

namespace LMS.web.Unity
{
    /// <summary>
    /// Factory for injected class
    /// </summary>
    public static class UnityFactory
    {
        /// <summary>
        /// Return Static Instance of Logger
        /// </summary>
        /// <returns></returns>
        public static ILogger GetLogger()
        {
            return UnityConfig.GetConfiguredContainer().Resolve<ILogger>();
        }
    }
}