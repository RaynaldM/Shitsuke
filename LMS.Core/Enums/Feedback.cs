namespace LMS.Core.Enums
{
    public enum FeedbackType : byte
    {
        Bug = 0,
        Feedback = 1,
        Question = 2
    }

    public enum FeedbackStatus : byte
    {
        New = 0,
        Open = 1,
        Answered=2,
        Close = 3
    }
}
