using System;

namespace LMS.Core.Domain
{
    public interface ILogModel
    {
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