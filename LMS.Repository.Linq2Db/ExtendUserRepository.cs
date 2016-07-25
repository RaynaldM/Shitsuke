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
    public class ExtendUserRepository : Linq2DBRepository, IRepository<extenduser, Guid>
    {

        public IQueryable<extenduser> Get(Expression<Func<extenduser, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public IQueryable<extenduser> Get()
        {
            throw new NotImplementedException();
        }

        public extenduser Get(Guid id)
        {
            throw new NotImplementedException();
        }

        public extenduser Get(Guid id, string key)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<extenduser>()
                          where p.userid == id && p.key == key
                          select p;
                return qry.FirstOrDefault();
            }
        }

        public Guid Insert(extenduser entity)
        {
            using (var db = this.DBFactory())
            {
                try
                {
                    db.BeginTransaction(IsolationLevel.ReadUncommitted);

                    db.InsertWithIdentity(entity);

                    db.CommitTransaction();
                    return entity.userid;
                }
                catch (Exception)
                {
                    db.RollbackTransaction();
                    throw;
                }
            }
        }

        public bool Update(extenduser entity)
        {
            using (var db = this.DBFactory())
            {
                try
                {
                    db.BeginTransaction(IsolationLevel.ReadUncommitted);

                    db.GetTable<extenduser>()
                        .Where(p => p.userid == entity.userid && p.key == entity.key)
                        .Set(s => s.value, entity.value)
                        .Update();


                    db.CommitTransaction();
                    return true;

                }
                catch (Exception)
                {
                    db.RollbackTransaction();
                    throw;
                }
            }
        }

        public bool Update(Guid id, extenduser entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(extenduser entity)
        {
            throw new NotImplementedException();
        }



    }
}
