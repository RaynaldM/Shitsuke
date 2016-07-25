using System;

namespace LMS.Core.Domain
{
    public interface IFullLogModel
    {
        string Machinename { get; set; }
        string Host { get; set; }
        string Httpmethod { get; set; }
        string Ipaddress { get; set; }
        string Source { get; set; }
        string Detail { get; set; }
        string Sql { get; set; }
        long Id { get; set; }
        string Applicationid { get; set; }
        DateTime Creationdate { get; set; }
        string Type { get; set; }
        byte Errorlevel { get; set; }
        int? Statuscode { get; set; }
        int? Errorhash { get; set; }
        string Url { get; set; }
        string Message { get; set; }
    }
}