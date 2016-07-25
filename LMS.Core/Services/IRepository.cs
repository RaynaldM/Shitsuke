using System;
using System.Linq;
using System.Linq.Expressions;

namespace LMS.Core.Services
{
   public interface IRepository<TEnt, TPk> where TEnt : class
    {
        IQueryable<TEnt> Get(Expression<Func<TEnt, bool>> predicate);
        IQueryable<TEnt> Get();
        TEnt Get(TPk id);
        TPk Insert(TEnt entity);
        bool Update(TPk id, TEnt entity);
        void Delete(TEnt entity);
    }
}
