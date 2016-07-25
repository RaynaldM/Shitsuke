using DataModels;

namespace LMS.Repository.Linq2Db.Helpers
{
    public abstract class Linq2DBRepository
    {
        public LMSDB DBFactory()
        {
            return new LMSDB("LMSDB");
        }
    }
}
