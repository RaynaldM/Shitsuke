using System;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;

namespace LMS.Repository.Linq2Db.Helpers
{
    public static class SortingHelper
    {
        public static IQueryable<T> ApplySorting<T, U>(this IQueryable<T> query, Expression<Func<T, U>> predicate, SortOrder order)
        {
            var ordered = query as IOrderedQueryable<T>;
            var isordered = query.Expression.Type == typeof(IOrderedQueryable<T>);
            if (order == SortOrder.Ascending)
            {
                if (isordered && ordered != null)
                    return ordered.ThenBy(predicate);
                return query.OrderBy(predicate);
            }

            if (isordered && ordered != null)
                return ordered.ThenByDescending(predicate);
            return query.OrderByDescending(predicate);
        }
  
    }
}
