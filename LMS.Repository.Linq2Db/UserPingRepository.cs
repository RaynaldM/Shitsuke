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
    // todo Faire un truc generique comme https://github.com/linq2db/linq2db/wiki/Creating-Generic-CRUD-Class
    public partial class UserPingRepository : Linq2DBRepository, IRepository<userping, long>
    {
        public IQueryable<userping> Get(Expression<Func<userping, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public IQueryable<userping> Get()
        {
            using (var db = this.DBFactory())
            {
                return db.GetTable<userping>();
            }
        }

        public userping Get(long id)
        {
            throw new NotImplementedException();
        }

        public long Insert(userping entity)
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

        public bool Update(long id, userping entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(userping entity)
        {
            throw new NotImplementedException();
        }

    }
}