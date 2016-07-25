using System;
using LMS.Core.Domain;

namespace LMS.Domain
{
    public class OccurenceModel : IOccurenceModel
    {
        public int HashId { get; set; }
        public int Count { get; set; }
        public DateTime LastDate { get; set; }
        public byte Level { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
    }
}
