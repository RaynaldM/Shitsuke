namespace LMS.Core.Domain
{
    public interface IFeedbackViewModel
    {
        string Screenshot { get; set; }
        string Browserinfo { get; set; }
        string Userid { get; set; }
    }
}