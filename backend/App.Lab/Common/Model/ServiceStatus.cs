namespace App.Common.Models
{
    /// <summary> Respon API mesege </summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class ServiceStatus
    {
        public bool IsSuccess { get; private set; }
        public string ErroMessage { get; private set; }
        public object Data { get; private set; }

        private ServiceStatus() { }

        /// <summary>Successes the specified data.</summary>
        /// <param name="Data">The data.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static ServiceStatus Success(object Data = null)
        {
            return new ServiceStatus()
            {
                IsSuccess = true,
                Data = Data
            };
        }

        /// <summary>Failures the specified error message.</summary>
        /// <param name="ErrorMessage">The error message.</param>
        /// <param name="Data">The data.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
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
