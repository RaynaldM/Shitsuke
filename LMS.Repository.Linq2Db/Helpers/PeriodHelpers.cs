using System;
using System.Collections.Generic;

namespace LMS.Repository.Linq2Db.Helpers
{
    public class PeriodHelpers
    {
        public static PeriodGap ComputeGap(DateTime endDate, byte typeperiod)
        {
            PeriodGap result = new PeriodGap
            {
                gapDate = new List<DateTime>(),
                gap = new TimeSpan(0, -59, -59)
            };

            DateTime cDate = endDate;
            switch (typeperiod)
            {
                case 0:// Day
                    for (int i = 0; i < 24; i++)
                    {
                        result.gapDate.Add(cDate);
                        cDate = cDate.AddHours(-1);
                    }
                    result.gap = new TimeSpan(0, -59, -59);
                    break;
                case 1:// Week
                    for (int i = 0; i < 7; i++)
                    {
                        result.gapDate.Add(cDate);
                        cDate = cDate.AddDays(-1);
                    }
                    result.gap = new TimeSpan(-23, -59, -59);
                    break;
                case 2:// month (last 30 days)
                    for (int i = 0; i < 30; i++)
                    {
                        result.gapDate.Add(cDate);
                        cDate = cDate.AddDays(-1);
                    }
                    result.gap = new TimeSpan(-23, -59, -59);
                    break;
            }
            return result;
        }

        public static DateTime GetStartDate(DateTime endDate, byte typeperiod)
        {
            DateTime result=endDate;

            switch (typeperiod)
            {
                case 0:// Day
                    result = endDate.AddHours(-24);
                    break;
                case 1:// Week
                    result = endDate.AddDays(-7);
                    break;
                case 2:// month (last 30 days)
                    result = endDate.AddDays(-30);
                    break;
            }
            return result;
        }
    }

    public struct PeriodGap
    {
        public TimeSpan gap { get; set; }
        public List<DateTime> gapDate { get; set; }
    }
}
