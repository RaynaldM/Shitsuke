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
    public partial class FeedbackRepository : Linq2DBRepository, IRepository<feedback, long>
    {
        public IQueryable<feedback> Get(Expression predicate)
        {
            throw new NotImplementedException();
        }

        public IQueryable<feedback> Get(Expression<Func<feedback, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public IQueryable<feedback> Get()
        {
            using (var db = this.DBFactory())
            {
                return db.GetTable<feedback>();
            }
        }

        public feedback Get(long id)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<feedback>()
                          where p.id == id
                          select p;
                return qry.FirstOrDefault();
            }
        }

        public long Insert(feedback entity)
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

        public bool Update(long id, feedback entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(feedback entity)
        {
            throw new NotImplementedException();
        }
    }
}
