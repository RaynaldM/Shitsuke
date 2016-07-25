
using System;

namespace LMS.Core.Models
{
    /// <summary>
    /// Serialization class in place of the NameValueCollection pairs
    /// </summary>
    /// <remarks>This exists because things like a querystring can havle multiple values, they are not a dictionary</remarks>
    public struct NameValuePair
    {
        /// <summary>
        /// The name for this variable
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// The value for this variable
        /// </summary>
        public string Value { get; set; }
    }

    /// <summary>
    /// Serialization class in place of the NameValueCollection pairs
    /// </summary>
    /// <remarks>This exists because things like a querystring can havle multiple values, they are not a dictionary</remarks>
    public struct NameValueIntPair
    {
        /// <summary>
        /// The name for this variable
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// The value for this variable
        /// </summary>
        public int Value { get; set; }
    }

    public struct miniLog
    {
        public long Id { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
    }
}
