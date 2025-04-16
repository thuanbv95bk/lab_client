namespace App.Common.Models
{
    public class ServiceStatus
    {
        public bool IsSuccess { get; private set; }
        public string ErroMessage { get; private set; }
        public object Data { get; private set; }

        private ServiceStatus() { }

        public static ServiceStatus Success(object Data = null)
        {
            return new ServiceStatus()
            {
                IsSuccess = true,
                Data = Data
            };
        }

        public static ServiceStatus Failure(string ErrorMessage, object Data = null)
        {
            return new ServiceStatus()
            {
                IsSuccess = false,
                ErroMessage = ErrorMessage,
                Data = Data
            };
        }
    }
}
