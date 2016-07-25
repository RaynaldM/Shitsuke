using System;
using LMS.Core.Domain;
using Newtonsoft.Json;

namespace LMS.Domain
{
    // todo move to elsewhere, this is a view model
    public class ApplicationModel : IApplicationModel
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "count")]
        public long PingCount { get; set; }
        [JsonProperty(PropertyName = "start")]
        public DateTime StartDate { get; set; }
        [JsonProperty(PropertyName = "last")]
        public DateTime LastDate { get; set; }
    }
}
