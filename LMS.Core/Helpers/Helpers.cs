using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Text.RegularExpressions;
using LMS.Core.Models;

namespace LMS.Core.Helpers
{
    public static class Helpers
    {
        public static IEnumerable<DateTime> GetMinutesInGap(this DateTime startDate, int gap)
        {
            var start = startDate;
            var lastMinutes = new List<DateTime>(gap);
            for (int t = 0; t < gap; t++)
            {
                lastMinutes.Add(new DateTime(start.Year, start.Month, start.Day, start.Hour, start.Minute, 0));
                start = start.AddMinutes(1);
            }
            return lastMinutes;
        }

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
        /// Returns the first non-null/non-empty parameter when this String is null/empty.
        /// </summary>
        public static string IsNullOrEmptyReturn(this string s, params string[] otherPossibleResults)
        {
            if (s.HasValue())
                return s;

            foreach (string t in otherPossibleResults ?? new string[0])
            {
                if (t.HasValue())
                    return t;
            }

            return "";
        }

        /// <summary>
        /// Answers true if this String is neither null or empty.
        /// </summary>
        /// <remarks>I'm also tired of typing !String.IsNullOrEmpty(s)</remarks>
        public static bool HasValue(this string s)
        {
            return !IsNullOrEmpty(s);
        }

        //http://www.dailycoding.com/posts/convert_image_to_base64_string_and_base64_string_to_image.aspx
        //http://www.advancesharp.com/blog/1188/mvc-display-image-from-database
        public static Image Base64ToImage(string base64String)
        {
            // Convert Base64 String to byte[]
            byte[] imageBytes = Convert.FromBase64String(base64String);
            MemoryStream ms = new MemoryStream(imageBytes, 0,
              imageBytes.Length);

            // Convert byte[] to Image
            ms.Write(imageBytes, 0, imageBytes.Length);
            Image image = Image.FromStream(ms, true);
            return image;
        }
    }
}
