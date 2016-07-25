using System.Collections.Generic;
using LMS.Core.Domain;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;

namespace LMS.Services
{
    public class ApplicationsService : BaseServices<UserPingRepository>, IBaseService
    {
        public IEnumerable<IApplicationModel> GetApplicationsList()
        {
            var result = this.Repository.GetApplicationsList();
           
            return result;
        }
    }
}
