using System;
using LMS.Core.Domain;

namespace LMS.Domain
{
    public class LogModel : ILogModel
    {
        public long Id { get; set; } // bigint
        public string Applicationid { get; set; } // char(8)
        public DateTime Creationdate { get; set; } // datetime
        public string Type { get; set; } // varchar(128)
        public byte Errorlevel { get; set; } // tinyint
        public int? Statuscode { get; set; } // int
        public int? Errorhash { get; set; } // int
        public string Url { get; set; } // varchar(512)
        public string Message { get; set; } // nvarchar(1024)
    }

    public class FullLogModel : LogModel, IFullLogModel
    {
        public string Machinename { get; set; } // varchar(64)
        public string Host { get; set; } // varchar(128)
        public string Httpmethod { get; set; } // varchar(8)
        public string Ipaddress { get; set; } // varchar(64)
        public string Source { get; set; } // nvarchar(128)
        public string Detail { get; set; } // nvarchar(max)
        public string Sql { get; set; } // nvarchar(max)
        //public string fulljson { get; set; } // nvarchar(max)
    }

    public class StatLogModel : IStatLogModel
    {
        public int Hashcode { get; set; }
        public DateTime FirstTime { get; set; }
        public DateTime LastTime { get; set; }
        public int Count { get; set; }
        //public int AvgHour { get; set; }
        //public int AvgDay { get; set; }
        //public int AvgWeek { get; set; }
        //public int AvgMonth { get; set; }
    }

}
