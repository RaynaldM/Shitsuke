using System.Threading.Tasks;

namespace LMS.web.Helpers.Hub
{
    /// <summary>
    /// SignalR Hub with a user counter
    /// </summary>
    public abstract class BaseHub : Microsoft.AspNet.SignalR.Hub
    {
        // Use this variable to track user count
        private static volatile int _userCount;

        // Overridable hub methods
        public override Task OnConnected()
        {
            _userCount++;
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _userCount--;
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            _userCount++;
            return base.OnReconnected();
        }

        /// <summary>
        /// Get true if there is a or more client
        /// </summary>
        public bool HaveUsers { get { return _userCount > 0; } }
    }
}