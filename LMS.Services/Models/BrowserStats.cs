using System.Collections.Generic;
using LMS.Core.Models;

namespace LMS.Services.Models
{
    public class HintedTechnoStats
    {
        public int total { get; set; }
        public IEnumerable<BrowserStat> BrowserTypes { get; set; }
        public IEnumerable<OsStat> OSTypes { get; set; }
        public IEnumerable<NameValueIntPair> screenSize { get; set; }
    }

    public struct BrowserStat
    {
        public string Name { get; set; }
        public int Count { get; set; }
        public IEnumerable<NameValueIntPair> Version { get; set; }
    }

    public struct OsStat
    {
        public string Name { get; set; }
        public int Count { get; set; }
        public IEnumerable<NameValueIntPair> Version { get; set; }
    }
}
