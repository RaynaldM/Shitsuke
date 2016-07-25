using System;

namespace LMS.Core.Domain
{
    public interface IStatLogModel
    {
        int Hashcode { get; set; }
        DateTime FirstTime { get; set; }
        DateTime LastTime { get; set; }
        int Count { get; set; }
        //int AvgHour { get; set; }
        //int AvgDay { get; set; }
        //int AvgWeek { get; set; }
        //int AvgMonth { get; set; }
    }
}