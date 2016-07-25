using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LMS.web.Helpers.Hub;

namespace LMS.web.Hub
{
    public class FeedbackHub: BaseHub
    {
        public async void RefreshFeedBack(dynamic clientModel)
        {
            await Clients.All.refresh(clientModel);
        }
    }
}