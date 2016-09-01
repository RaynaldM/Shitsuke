using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using LMS.Drivers.NC.Core.Helpers;
using LMS.Drivers.NC.Core.Models;

namespace LMS.Drivers.NC.Core
{
    /// <summary>
    /// Represents a logical application error (as opposed to the actual exception it may be representing).
    /// </summary>
    public class Error : BaseError
    {
        /// <summary>
        /// Gets the data include pattern, like "SQL.*|Redis-*" to match against .Data keys to include when logging
        /// </summary>
        public static Regex DataIncludeRegex { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Error"/> class.
        /// </summary>
        public Error() { }

        /// <summary>
        /// Initializes a new instance of the <see cref="Error"/> class instance.
        /// </summary>
        public Error(string applicationName = null)
        {
            GUID = Guid.NewGuid();
            ApplicationName = applicationName;
            MachineName = Environment.MachineName;
            CreationDate = DateTime.UtcNow;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Error"/> class
        /// from a given Exception instance and 
        /// HttpContext instance representing the HTTP 
        /// context during the exception.
        /// </summary>
        public Error(Exception e, string applicationName = null):this(applicationName)
        {

            if (e == null) throw new ArgumentNullException(/*nameof(e)*/);

            this.Exception = e;
            var baseException = e;

            // if it's not a .Net core exception, usually more information is being added
            // so use the wrapper for the message, type, etc.
            // if it's a .Net core exception type, drill down and get the innermost exception
            if (IsBuiltInException(e))
                baseException = e.GetBaseException();

          
            Type = baseException.GetType().FullName;
            Message = baseException.Message;
            Source = baseException.Source;
            Detail = e.ToString();
         
            // todo : fix it with the right package 4.5 > core
            //var httpException = e as HttpException;
            //if (httpException != null)
            //{
            //    StatusCode = httpException.GetHttpCode();
            //}

            this.AddFromData(e);
            ErrorHash = GetHash();
        }

        protected void AddFromData(Exception exception)
        {
            // Historical special case
            if (exception.Data.Contains("SQL"))
                SQL = exception.Data["SQL"] as string;

            var se = exception as SqlException;
            if (se != null)
            {
                if (CustomData == null)
                    CustomData = new Dictionary<string, string>();

                CustomData["SQL-Server"] = se.Server;
                CustomData["SQL-ErrorNumber"] = se.Number.ToString();
                CustomData["SQL-LineNumber"] = se.LineNumber.ToString();
                if (se.Procedure.HasValue())
                {
                    CustomData["SQL-Procedure"] = se.Procedure;
                }
            }
            // Regardless of what Resharper may be telling you, .Data can be null on things like a null ref exception.
            if (DataIncludeRegex != null)
            {
                if (CustomData == null)
                    CustomData = new Dictionary<string, string>();

                foreach (string k in exception.Data.Keys)
                {
                    if (!DataIncludeRegex.IsMatch(k)) continue;
                    CustomData[k] = exception.Data[k] != null ? exception.Data[k].ToString() : "";
                }
            }
        }

        /// <summary>
        /// returns if the type of the exception is built into .Net core
        /// </summary>
        /// <param name="e">The exception to check</param>
        /// <returns>True if the exception is a type from within the CLR, false if it's a user/third party type</returns>
        protected bool IsBuiltInException(Exception e)
        {
            return false;
            // todo : fix it 4.5 > core
            //   return e.GetType().Module.ScopeName == "CommonLanguageRuntimeLibrary";
        }

        /// <summary>
        /// Gets a unique-enough hash of this error.  Stored as a quick comparison mechanism to rollup duplicate errors.
        /// </summary>
        /// <returns>"Unique" hash for this error</returns>
        public int? GetHash()
        {
            if (!Detail.HasValue()) return null;

            var result = Detail.GetHashCode();

            return result;
        }
    }
}

