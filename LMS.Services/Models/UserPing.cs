using System;
using System.ComponentModel.DataAnnotations;
using LMS.Core.Domain;
using Newtonsoft.Json;

namespace LMS.Services.Models
{
    public class UserPing : IUserPing
    {
        [JsonIgnore]
        [Key]
        public long Id;

        [JsonProperty("uid", Required = Required.Always)]
        public string UserId { get; set; }
        [JsonProperty("aid", Required = Required.Always)]
        public string ApplicationId { get; set; }
        [JsonProperty("pid")]
        public string PageId { get; set; }
        [JsonProperty("info")]
        public string BrowserInfo { get; set; }
        [JsonIgnore]
        public DateTime? UtcTimeStamp { get; set; }
        [JsonIgnore]
        public bool IsValid
        {
            get { return !String.IsNullOrWhiteSpace(this.UserId) && !string.IsNullOrWhiteSpace(this.ApplicationId); }
        }
    }

    public class BrowserInfo
    {
        public string screen { get; set; }
        public string browser { get; set; }
        public string browserVersion { get; set; }
        public string browserMajorVersion { get; set; }
        public bool mobile { get; set; }
        public string os { get; set; }
        public string osVersion { get; set; }
    }
}
