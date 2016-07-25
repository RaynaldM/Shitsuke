using System;
using DataModels;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;

namespace LMS.Services
{
    public class ExtendUserService : BaseServices<ExtendUserRepository>, IBaseService
    {
        public string GetValue(Guid userId, string key)
        {
            var ext = this.Repository.Get(userId, key);
            return ext == null ? string.Empty : ext.value;
        }

        public bool AddOrUpdate(Guid userId, string key, string value)
        {
            var ext = this.Repository.Get(userId, key);
            if (ext != null)
            {
                ext.value = value;
                return this.Repository.Update(ext);
            }
            ext = new extenduser { userid = userId, key = key, value = value };
            this.Repository.Insert(ext);
            return true;
        }
    }
}
