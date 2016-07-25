using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Driver.TraceListener
{
    // todo
    // http://www.daveoncsharp.com/2009/09/create-a-logger-using-the-trace-listener-in-csharp/
    //http://www.codeguru.com/csharp/.net/article.php/c19405/Tracing-in-NET-and-Implementing-Your-Own-Trace-Listeners.htm
    public class LMSTraceListener:System.Diagnostics.TraceListener
    {
        public override void Write(string message)
        {
            throw new NotImplementedException();
        }

        public override void WriteLine(string message)
        {
            throw new NotImplementedException();
        }
    }
}
