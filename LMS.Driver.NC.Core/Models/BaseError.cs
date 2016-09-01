using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using LMS.Core.Models;
using LMS.Drivers.NC.Core.Helpers;
using Newtonsoft.Json;

namespace LMS.Drivers.NC.Core.Models
{
    /// <summary>
    /// Represents a logical application error (as opposed to the actual exception it may be representing).
    /// </summary>
     public class BaseError
    {
        /// <summary>
        /// Unique identifier for this error, gernated on the server it came from
        /// </summary>
        public Guid GUID { get; set; }

        /// <summary>
        /// Gets the <see cref="Exception"/> instance used to create this error
        /// </summary>
        public Exception Exception { get; set; }

        /// <summary>
        /// Gets the name of the application that threw this exception
        /// </summary>
        public string ApplicationName { get; set; }

        /// <summary>
        /// Gets the hostname of where the exception occured
        /// </summary>
        public string MachineName { get; set; }

        /// <summary>
        /// Get the type of error
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets the source of this error
        /// </summary>
        public string Source { get; set; }

        /// <summary>
        /// Gets the exception message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets the detail/stack trace of this error
        /// </summary>
        public string Detail { get; set; }

        /// <summary>
        /// The hash that describes this error
        /// </summary>
        public int? ErrorHash { get; set; }

        /// <summary>
        /// Gets the time in UTC that the error occured
        /// </summary>
        public DateTime CreationDate { get; set; }

        /// <summary>
        /// Gets the HTTP Status code associated with the request
        /// </summary>
        public int? StatusCode { get; set; }

        public ErrorLevel? ErrorLevel { get; set; }

        /// <summary>
        /// Gets the server variables collection for the request
        /// </summary>
        [JsonIgnore]
        public NameValueCollection ServerVariables { get; set; }

        /// <summary>
        /// Gets the query string collection for the request
        /// </summary>
        [JsonIgnore]
        public NameValueCollection QueryString { get; set; }

        /// <summary>
        /// Gets the form collection for the request
        /// </summary>
        [JsonIgnore]
        public NameValueCollection Form { get; set; }

        /// <summary>
        /// Gets a collection representing the client cookies of the request
        /// </summary>
        [JsonIgnore]
        public NameValueCollection Cookies { get; set; }

        /// <summary>
        /// Gets a collection representing the headers sent with the request
        /// </summary>
        [JsonIgnore]
        public NameValueCollection RequestHeaders { get; set; }

        /// <summary>
        /// Gets a collection of custom data added at log time
        /// </summary>
        public Dictionary<string, string> CustomData { get; set; }

        /// <summary>
        /// Gets the SQL command text assocaited with this error
        /// </summary>
        public string SQL { get; set; }

        /// <summary>
        /// The URL host of the request causing this error
        /// </summary>
        public string Host { get { return _host ?? (_host = ServerVariables == null ? "" : ServerVariables["HTTP_HOST"]); } set { _host = value; } }
        private string _host;

        /// <summary>
        /// The URL path of the request causing this error
        /// </summary>
        [JsonIgnore]
        public string Url { get { return _url ?? (_url = ServerVariables == null ? "" : ServerVariables["URL"]); } set { _url = value; } }
        private string _url;

        /// <summary>
        /// The HTTP Method causing this error, e.g. GET or POST
        /// </summary>
        [JsonIgnore]
        public string HTTPMethod { get { return _httpMethod ?? (_httpMethod = ServerVariables == null ? "" : ServerVariables["REQUEST_METHOD"]); } set { _httpMethod = value; } }
        private string _httpMethod;

        /// <summary>
        /// The IPAddress of the request causing this error
        /// </summary>
        [JsonIgnore]
        public string IPAddress { get { return _ipAddress ?? (_ipAddress = ServerVariables == null ? "" : ServerVariables.GetRemoteIP()); } set { _ipAddress = value; } }
        private string _ipAddress;

        /// <summary>
        /// Json populated from database stored, deserialized after if needed
        /// </summary>
        [JsonIgnore]
        public string FullJson { get; set; }

        /// <summary>
        /// Variables strictly for JSON serialziation, to maintain non-dictonary behavior
        /// </summary>
        public List<NameValuePair> ServerVariablesSerializable
        {
            get { return Helpers.Helpers.GetPairs(ServerVariables); }
            set { ServerVariables = Helpers.Helpers.GetNameValueCollection(value); }
        }

        /// <summary>
        /// Variables strictly for JSON serialziation, to maintain non-dictonary behavior
        /// </summary>
        public List<NameValuePair> QueryStringSerializable
        {
            get { return Helpers.Helpers.GetPairs(QueryString); }
            set { QueryString = Helpers.Helpers.GetNameValueCollection(value); }
        }

        /// <summary>
        /// Variables strictly for JSON serialziation, to maintain non-dictonary behavior
        /// </summary>
        public List<NameValuePair> FormSerializable
        {
            get { return Helpers.Helpers.GetPairs(Form); }
            set { Form = Helpers.Helpers.GetNameValueCollection(value); }
        }

        /// <summary>
        /// Variables strictly for JSON serialziation, to maintain non-dictonary behavior
        /// </summary>
        public List<NameValuePair> CookiesSerializable
        {
            get { return Helpers.Helpers.GetPairs(Cookies); }
            set { Cookies = Helpers.Helpers.GetNameValueCollection(value); }
        }

        /// <summary>
        /// Variables strictly for JSON serialziation, to maintain non-dictonary behavior
        /// </summary>
        public List<NameValuePair> RequestHeadersSerializable
        {
            get { return Helpers.Helpers.GetPairs(RequestHeaders); }
            set { RequestHeaders = Helpers.Helpers.GetNameValueCollection(value); }
        }

        /// <summary>
        /// Returns the value of the error property.
        /// </summary>
        public override string ToString()
        {
            return Message;
        }
    }

    public enum ErrorLevel
    {
        Verbose, // = trace for nlog
        Debug,
        Information,
        Warning,
        Error,
        Fatal,
    }
}

