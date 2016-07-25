using System;
using System.Linq;
using System.Threading.Tasks;
using LMS.Core.Models;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;
using LMS.Services.Models;
using Newtonsoft.Json;

namespace LMS.Services
{
    public class HintedServices : BaseServices<UserPingRepository>, IBaseService
    {
        public int[] GetHintedUsers(string appId, byte period, DateTime endDate)
        {
            var result = this.Repository.GetHintedUsers(appId, period, endDate);
            return result;
        }

        public int[] GetHintedPages(string appId, byte period, DateTime endDate)
        {
            var result = this.Repository.GetHintedPages(appId, period, endDate);
            return result;
        }

        public Task<NameValueIntPair[]> GetTopPages(string appId, byte period, DateTime endDate, int count = 10)
        {
            var result = this.Repository.GetTopPages(appId, period, endDate, count);
            return result;
        }

        public async Task<HintedTechnoStats> GetBrowsersStats(string appId, byte period, DateTime endDate)
        {
            var list = await this.Repository.GetBrowserStats(appId, period, endDate);
            list = list.AsParallel().Where(p => p.StartsWith("{")).ToArray();
            var browserInfoList = list.AsParallel().Select(JsonConvert.DeserializeObject<BrowserInfo>).ToArray();

            HintedTechnoStats result = new HintedTechnoStats
            {
                total = browserInfoList.Length,
                BrowserTypes = browserInfoList.AsParallel().GroupBy(g => g.browser).Select(info => new BrowserStat
                {
                    Name = info.Key,
                    Count = info.Count(),
                    Version =
                        browserInfoList.AsParallel().Where(p => p.browser == info.Key)
                            .GroupBy(g => g.browserVersion)
                            .Select(subInfo => new NameValueIntPair {Name = subInfo.Key, Value = subInfo.Count()})
                            .OrderByDescending(o => o.Value)
                            .ToArray()
                }).
                    OrderByDescending(o => o.Count)
                    .ToArray(),
                OSTypes = browserInfoList.AsParallel().GroupBy(g => g.os).Select(info => new OsStat
                {
                    Name = info.Key,
                    Count = info.Count(),
                    Version =
                        browserInfoList.AsParallel().Where(p => p.os == info.Key)
                            .GroupBy(g => g.osVersion)
                            .Select(subInfo => new NameValueIntPair {Name = subInfo.Key, Value = subInfo.Count()})
                            .OrderByDescending(o => o.Value)
                            .ToArray()
                })
                    .OrderByDescending(o => o.Count)
                    .ToArray(),
                screenSize =
                    browserInfoList.GroupBy(g => g.screen)
                        .Select(info => new NameValueIntPair {Name = info.Key, Value = info.Count()})
                        .OrderByDescending(o => o.Value)
                        .Take(100)
                        .ToArray()
            };

            return result;
        }
    }
}
