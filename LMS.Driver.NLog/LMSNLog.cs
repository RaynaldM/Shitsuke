﻿using System;
using LMS.Driver.NLog.Models;
using LMS.Drivers.Core;
using NLog;
using NLog.Config;
using NLog.Targets;

namespace LMS.Driver.NLog
{
    [Target("LMSNLog")]
    public class LMSNLog : Target// TargetWithLayout
    {
        public LMSNLog()
        {
            this.Host = "localhost";
            this.Token = Guid.Empty;
        }

        [RequiredParameter]
        public string Host { get; set; }
        [RequiredParameter]
        public Guid Token { get; set; }
        [RequiredParameter]
        public string ApplicationName { get; set; }

        protected override void Write(LogEventInfo logEvent)
        {
            var restClient = new RestApi(new Uri(this.Host), this.Token);
            // todo : try to do something more async
#pragma warning disable 4014
            restClient.Log(new ErrorFromNlog(logEvent, this.ApplicationName));
#pragma warning restore 4014
        }
    }
}
