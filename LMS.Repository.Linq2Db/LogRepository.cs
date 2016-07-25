using System;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using DataModels;
using LinqToDB;
using LMS.Core.Services;
using LMS.Repository.Linq2Db.Helpers;

namespace LMS.Repository.Linq2Db
{
    public partial class LogRepository : Linq2DBRepository, IRepository<log, long>
    {
        public IQueryable<log> Get(Expression<Func<log, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public IQueryable<log> Get()
        {
            using (var db = this.DBFactory())
            {
                return db.GetTable<log>();
            }
        }

        public log Get(long id)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<log>()
                          where p.id == id
                          select p;
                return qry.FirstOrDefault();
            }
        }

        public long Insert(log entity)
        {
            using (var db = this.DBFactory())
            {
                try
                {
                    db.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var pks = db.InsertWithIdentity(entity).ToString();
                    long pk;
                    if (long.TryParse(pks, out pk))
                    {
                        db.CommitTransaction();
                        return pk;
                    }
                    db.RollbackTransaction();
                    return -1;
                }
                catch
                (Exception)
                {
                    db.RollbackTransaction();
                    throw;
                }
            }
        }

        public bool Update(long id, log entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(log entity)
        {
            throw new NotImplementedException();
        }
    }
}
