using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using LMS.Core.Models;

namespace LMS.Drivers.NC.Core.Helpers
{
    public static class Helpers
    {
      
        public static NameValueCollection GetNameValueCollection(IEnumerable<NameValuePair> pairs)
        {
            var result = new NameValueCollection();
            if (pairs == null) return null;

            foreach (var p in pairs)
            {
                result.Add(p.Name, p.Value);
            }
            return result;
        }

        public static List<NameValuePair> GetPairs(NameValueCollection nvc)
        {
            var result = new List<NameValuePair>();
            if (nvc == null) return null;

            for (int i = 0; i < nvc.Count; i++)
            {
                result.Add(new NameValuePair { Name = nvc.GetKey(i), Value = nvc.Get(i) });
            }
            return result;
        }

        /// <summary>
        /// When a client IP can't be determined
        /// </summary>
        public const string UnknownIP = "0.0.0.0";

        private static readonly Regex IPv4Regex = new Regex(@"\b([0-9]{1,3}\.){3}[0-9]{1,3}$", RegexOptions.Compiled | RegexOptions.ExplicitCapture);

        /// <summary>
        /// returns true if this is a private network IP  
        /// http://en.wikipedia.org/wiki/Private_network
        /// </summary>
        private static bool IsPrivateIP(string s)
        {
            return (s.StartsWith("192.168.") || s.StartsWith("10.") || s.StartsWith("127.0.0."));
        }

        /// <summary>
        /// retrieves the IP address of the current request -- handles proxies and private networks
        /// </summary>
        public static string GetRemoteIP(this NameValueCollection serverVariables)
        {
            var ip = serverVariables["REMOTE_ADDR"]; // could be a proxy -- beware
            var ipForwarded = serverVariables["HTTP_X_FORWARDED_FOR"];

            // check if we were forwarded from a proxy
            if (ipForwarded.HasValue())
            {
                ipForwarded = IPv4Regex.Match(ipForwarded).Value;
                if (ipForwarded.HasValue() && !IsPrivateIP(ipForwarded))
                    ip = ipForwarded;
            }

            return ip.HasValue() ? ip : UnknownIP;
        }

        /// <summary>
        /// Answers true if this String is either null or empty.
        /// </summary>
        /// <remarks>I'm so tired of typing String.IsNullOrEmpty(s)</remarks>
        public static bool IsNullOrEmpty(this string s)
        {
            return string.IsNullOrEmpty(s);
        }
        
        /// <summary>
        /// Answers true if this String is neither null or empty.
        /// </summary>
        /// <remarks>I'm also tired of typing !String.IsNullOrEmpty(s)</remarks>
        public static bool HasValue(this string s)
        {
            return !IsNullOrEmpty(s);
        }
    }
}
