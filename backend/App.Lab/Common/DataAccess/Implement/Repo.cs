
using System.Data;
using System.Text;
using App.Common.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;


namespace App.DataAccess
{
    public class Repo : Accessor
    {
        private readonly IUnitOfWork _unitOfWork;
        public string Schema;

        //private static readonly JsonSerializerOptions jsonSerializeroptions = new JsonSerializerOptions
        //{
        //    Converters =
        //{
        //        new BooleanConverter(),
        //        new NullableBooleanConverter()
        //},
        //    PropertyNameCaseInsensitive = true
        //};

        public Repo(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Repo(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork) : base(httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>Gets the database information.</summary>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public string GetDbInfo()
        {
            return _unitOfWork.GetDbContext().Connection.ConnectionString;
        }

        #region "data helper"
        /// <summary>Executes the non query.</summary>
        /// <param name="commandText">The command text.</param>
        /// <param name="commandType">Type of the command.</param>
        /// <param name="parameters">The parameters.</param>
        /// <exception cref="System.Exception"></exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public int ExecuteNonQuery(string commandText, CommandType commandType = CommandType.Text, object parameters = null)
        {
            IDbTransaction trans = null;
            int affectedRows = 0;

            try
            {
                // Xử lý schema cho stored procedure
                if (commandType == CommandType.StoredProcedure && !string.IsNullOrEmpty(Schema))
                {
                    commandText = $"{Schema}.{commandText}";
                }

                // Lấy connection từ UnitOfWork
                var connection = _unitOfWork.GetDbContext().Connection;

                // Mở kết nối nếu chưa mở
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }

                // Tạo command
                using (var cmd = connection.CreateCommand())
                {
                    // Thiết lập transaction
                    trans = _unitOfWork.GetTransaction() ?? connection.BeginTransaction();
                    cmd.Transaction = trans;

                    // Thiết lập command
                    cmd.CommandText = commandText;
                    cmd.CommandType = commandType;

                    // Thêm parameters nếu có
                    if (parameters != null)
                    {
                        AddParameters(cmd, parameters);
                    }

                    // Thực thi command
                    affectedRows = cmd.ExecuteNonQuery();

                    // Commit transaction nếu là transaction mới tạo
                    if (_unitOfWork.GetTransaction() == null)
                    {
                        trans.Commit();
                    }
                }

                return affectedRows;
            }
            catch (Exception ex)
            {
                // Rollback nếu có lỗi
                if (trans != null && _unitOfWork.GetTransaction() == null)
                {
                    trans.Rollback();
                }
                throw new Exception(ErrorMessage(ex, commandText, parameters), ex);
            }
            finally
            {
                // Dispose transaction nếu là transaction mới tạo
                if (_unitOfWork.GetTransaction() == null)
                {
                    trans?.Dispose();
                }
            }

        }

        /// <summary>Executes the scalar.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="commandText">The command text.</param>
        /// <param name="commandType">Type of the command.</param>
        /// <param name="parameters">The parameters.</param>
        /// <exception cref="System.Exception"></exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public T ExecuteScalar<T>(string commandText, CommandType commandType = CommandType.Text, object parameters = null)
        {
            IDbTransaction trans = null;
            object result = null;

            try
            {
                // Xử lý schema cho stored procedure
                if (commandType == CommandType.StoredProcedure && !string.IsNullOrEmpty(Schema))
                {
                    commandText = $"{Schema}.{commandText}";
                }

                // Lấy connection
                var connection = _unitOfWork.GetDbContext().Connection;

                // Mở kết nối nếu chưa mở
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }

                using (var cmd = connection.CreateCommand())
                {
                    // Thiết lập transaction
                    trans = _unitOfWork.GetTransaction() ?? connection.BeginTransaction();
                    cmd.Transaction = trans;

                    // Thiết lập command
                    cmd.CommandText = commandText;
                    cmd.CommandType = commandType;

                    // Thêm parameters
                    if (parameters != null)
                    {
                        AddParameters(cmd, parameters);
                    }

                    // Thực thi và lấy kết quả
                    result = cmd.ExecuteScalar();

                    // Commit nếu là transaction mới
                    if (_unitOfWork.GetTransaction() == null)
                    {
                        trans.Commit();
                    }

                    // Xử lý kết quả null
                    if (result == DBNull.Value || result == null)
                    {
                        return default(T);
                    }

                    return (T)Convert.ChangeType(result, typeof(T));
                }
            }
            catch (Exception ex)
            {
                // Rollback nếu có lỗi
                if (trans != null && _unitOfWork.GetTransaction() == null)
                {
                    trans.Rollback();
                }
                throw new Exception(ErrorMessage(ex, commandText, parameters), ex);
            }
            finally
            {
                // Dispose transaction nếu là transaction mới
                if (_unitOfWork.GetTransaction() == null)
                {
                    trans?.Dispose();
                }
            }
        }


        /// <summary>Executes the reader.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="commandText">The command text.</param>
        /// <param name="commandType">Type of the command.</param>
        /// <param name="parameters">The parameters.</param>
        /// <exception cref="System.Exception"></exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public List<T> ExecuteReader<T>(string commandText, CommandType commandType = CommandType.Text, object parameters = null)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            List<T> result = null;

            try
            {
                // Xử lý schema nếu là stored procedure
                if (commandType == CommandType.StoredProcedure && !string.IsNullOrEmpty(Schema))
                {
                    commandText = $"{Schema}.{commandText}";
                }

                // Mở kết nối nếu chưa mở
                var connection = _unitOfWork.GetDbContext().Connection;
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }

                // Tạo command
                var cmd = connection.CreateCommand();
                cmd.CommandText = commandText;
                cmd.CommandType = commandType;

                // Thêm transaction nếu có
                trans = _unitOfWork.GetTransaction() ?? connection.BeginTransaction();
                cmd.Transaction = trans;

                // Thêm parameters nếu có
                if (parameters != null)
                {
                    AddParameters(cmd, parameters);
                }

                // Thực thi
                dr = cmd.ExecuteReader();

                // Map kết quả
                result = CBO.FillList<T>(dr);

                // Commit transaction nếu là transaction mới tạo
                if (_unitOfWork.GetTransaction() == null && trans != null)
                {
                    trans.Commit();
                }

                return result;
            }
            catch (Exception ex)
            {
                // Rollback nếu có lỗi
                if (trans != null && _unitOfWork.GetTransaction() == null)
                {
                    trans.Rollback();
                }
                throw new Exception(ErrorMessage(ex, commandText, parameters), ex);
            }
            finally
            {
                dr?.Close();
                // Dispose transaction nếu là transaction mới tạo
                if (_unitOfWork.GetTransaction() == null)
                {
                    trans?.Dispose();
                }
            }
        }

        public void ExecuteReader<T>(out List<T> ret, out int TotalCount, string commandText, CommandType commandType = CommandType.Text, object parameters = null)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            List<T> result = null;

            try
            {
                // Xử lý schema nếu là stored procedure
                if (commandType == CommandType.StoredProcedure && !string.IsNullOrEmpty(Schema))
                {
                    commandText = $"{Schema}.{commandText}";
                }

                // Mở kết nối nếu chưa mở
                var connection = _unitOfWork.GetDbContext().Connection;
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }

                // Tạo command
                var cmd = connection.CreateCommand();
                cmd.CommandText = commandText;
                cmd.CommandType = commandType;

                // Thêm transaction nếu có
                trans = _unitOfWork.GetTransaction() ?? connection.BeginTransaction();
                cmd.Transaction = trans;

                // Thêm parameters nếu có
                if (parameters != null)
                {
                    AddParameters(cmd, parameters);
                }

                // Thực thi
                dr = cmd.ExecuteReader();
             

                // Map kết quả
                ret = CBO.FillList<T>(dr, "TotalCount", out TotalCount);
                //result = CBO.FillList<T>(dr);

                // Commit transaction nếu là transaction mới tạo
                if (_unitOfWork.GetTransaction() == null && trans != null)
                {
                    trans.Commit();
                }

               
            }
            catch (Exception ex)
            {
                // Rollback nếu có lỗi
                if (trans != null && _unitOfWork.GetTransaction() == null)
                {
                    trans.Rollback();
                }
                throw new Exception(ErrorMessage(ex, commandText, parameters), ex);
            }
            finally
            {
                dr?.Close();
                // Dispose transaction nếu là transaction mới tạo
                if (_unitOfWork.GetTransaction() == null)
                {
                    trans?.Dispose();
                }
            }
        }

        /// <summary>Executes the command.</summary>
        /// <param name="dr">The dr.</param>
        /// <param name="trans">The trans.</param>
        /// <param name="sqlCommand">The SQL command.</param>
        /// <param name="commandParameters">The command parameters.</param>
        /// <exception cref="System.NotImplementedException">Chỉ hỗ trợ SQL Server</exception>
        /// <exception cref="System.InvalidCastException">Kết nối không phải SqlConnection</exception>
        /// <exception cref="System.Exception">Lỗi thực thi command</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        private void _ExecCommand(out IDataReader dr, out IDbTransaction trans, string sqlCommand, SqlParameter[] commandParameters)
        {
            dr = null;
            trans = null;

            // Lấy đối tượng database context
            var dbContext = _unitOfWork.GetDbContext();

            // Kiểm tra loại database
            if (!dbContext.IsSqlServer())
            {
                throw new NotImplementedException("Chỉ hỗ trợ SQL Server");
            }

            // Ép kiểu connection sang SqlConnection
            var sqlConnection = dbContext.Connection as SqlConnection;
            if (sqlConnection == null)
            {
                throw new InvalidCastException("Kết nối không phải SqlConnection");
            }

            // Kiểm tra transaction hiện có
            var existingTrans = _unitOfWork.GetTransaction() as SqlTransaction;

            if (existingTrans == null)
            {
                // TẠO TRANSACTION MỚI
                // Đảm bảo kết nối đã mở
                if (sqlConnection.State != ConnectionState.Open)
                {
                    sqlConnection.Open(); // Mở kết nối nếu chưa mở
                }

                // Bắt đầu transaction mới
                trans = sqlConnection.BeginTransaction();
            }
            else
            {
                // SỬ DỤNG TRANSACTION CÓ SẴN
                trans = existingTrans;
            }

            // TẠO VÀ CẤU HÌNH COMMAND
            var cmd = sqlConnection.CreateCommand();
            cmd.Transaction = trans as SqlTransaction; // Gán transaction
            cmd.CommandText = sqlCommand; // Câu lệnh SQL
            cmd.CommandType = CommandType.Text; // Loại command

            // THÊM PARAMETERS NẾU CÓ
            if (commandParameters != null && commandParameters.Length > 0)
            {
                cmd.Parameters.AddRange(commandParameters); // Thêm tất cả parameters
            }

            try
            {
                // THỰC THI VÀ TRẢ VỀ DATA READER
                dr = cmd.ExecuteReader(CommandBehavior.Default);

                // Giữ kết nối mở cho các thao tác tiếp theo
                // Sử dụng CommandBehavior.Default để không đóng kết nối
            }
            catch (Exception ex)
            {
                // XỬ LÝ NGOẠI LỆ
                if (existingTrans == null) // Chỉ rollback nếu tạo transaction mới
                {
                    trans.Rollback();
                    sqlConnection.Close(); // Đóng kết nối nếu tự mở
                }
                throw new Exception("Lỗi thực thi command", ex);
            }
        }


        /// <summary>Gets the table data.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ret">The ret.</param>
        /// <param name="tableName">Name of the table.</param>
        /// <param name="lstColumn">The LST column.</param>
        /// <param name="lstFilterOption">The LST filter option.</param>
        /// <param name="lstOrderOption">The LST order option.</param>
        /// <exception cref="System.Exception">sqlCommand: " + sqlCommand + ": " + ex.ToString()</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void GetTableData<T>(out List<T> ret, string tableName, string[] lstColumn = null, FilterOption[] lstFilterOption = null, OrderOption[] lstOrderOption = null)
        {

            if (!string.IsNullOrEmpty(Schema))
                tableName = $"[{Schema}.{tableName}]";

            SqlParameter[] commandParameters = null;
            StringBuilder queryBuilder = new StringBuilder();
            queryBuilder.Append(" SELECT ");

            // lst column select
            if (lstColumn == null || lstColumn.Length == 0)
            {
                queryBuilder.Append(" * ");
            }
            else if (lstColumn.Length == 1)
            {
                queryBuilder.Append(string.Join(" , ", lstColumn));
            }

            // from
            queryBuilder.Append($" FROM {tableName} ");

            // Generate filter conditions
            if (lstFilterOption != null && lstFilterOption.Length > 0)
            {
                queryBuilder.Append(" WHERE 1=1 ");
                foreach (var filter in lstFilterOption)
                {
                    if (filter.ValueType == "bool" && filter.Value == "0")
                    {
                        queryBuilder.Append($" AND ( {filter.Column} {filter.Operator} {filter.Value} or {filter.Column} is null )");
                    }
                    else
                    {
                        queryBuilder.Append($" AND {filter.Column} {filter.Operator} {filter.Value} ");
                    }

                }
            }

            // Generate sort configurations
            if (lstOrderOption != null && lstOrderOption.Length > 0)
            {
                queryBuilder.Append(" ORDER BY ");
                queryBuilder.Append(string.Join(" , ", lstOrderOption.Select(x => x.ToString())));
            }

            var sqlCommand = queryBuilder.ToString();

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, sqlCommand, commandParameters);

                ret = CBO.FillList<T>(dr);

                if (trans != null)
                {
                    trans.Commit();
                    trans.Dispose();
                }
            }
            catch (Exception ex)
            {
                dr?.Close();
                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }
                throw new Exception("sqlCommand: " + sqlCommand + ": " + ex.ToString());
            }
        }

        /// <summary>Executes the command.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ret">The ret.</param>
        /// <param name="sqlCommand">The SQL command.</param>
        /// <param name="parameters">The parameters.</param>
        /// <exception cref="System.Exception">sqlCommand: " + sqlCommand + ": " + ex.ToString()</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void ExecCommand<T>(out List<T> ret, string sqlCommand, SqlParameter[] parameters)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, sqlCommand, parameters);

                ret = CBO.FillList<T>(dr);

                if (trans != null)
                {
                    trans.Commit();
                    trans.Dispose();
                }
            }
            catch (Exception ex)
            {
                dr?.Close();
                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }
                throw new Exception("sqlCommand: " + sqlCommand + ": " + ex.ToString());
            }
        }

        /// <summary>Executes the command.</summary>
        /// <param name="sqlCommand">The SQL command.</param>
        /// <param name="commandParameters">The command parameters.</param>
        /// <exception cref="System.Exception">sqlCommand: " + sqlCommand + ": " + ex.ToString()</exception>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public void ExecCommand(string sqlCommand, SqlParameter[] commandParameters)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, sqlCommand, commandParameters);

                dr?.Close();

                if (trans != null)
                {
                    trans.Commit();
                    trans.Dispose();
                }
            }
            catch (Exception ex)
            {
                dr?.Close();
                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }
                throw new Exception("sqlCommand: " + sqlCommand + ": " + ex.ToString());
            }
        }
        /// <summary>Maps to SQL parameters.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj">The object.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public SqlParameter[] MapToSqlParameters<T>(T obj)
        {
            var properties = typeof(T).GetProperties();
            var parameters = new List<SqlParameter>();

            foreach (var property in properties)
            {
                var value = property.GetValue(obj) ?? DBNull.Value;
                parameters.Add(new SqlParameter($"@{property.Name}", value));
            }

            return parameters.ToArray();
        }


        /// <summary>Maps the filter to options.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="filter">The filter.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public FilterOption[] MapFilterToOptions<T>(T filter)
        {
            var filterOptions = new List<FilterOption>();
            var properties = typeof(T).GetProperties();

            foreach (var property in properties)
            {
                var value = Null.GetDBNull(property.GetValue(filter));
                if (value != null && !string.IsNullOrEmpty(value.ToString()))
                {
                    string valueString;
                    var isTypeBool = false;
                    if (property.PropertyType == typeof(bool) || property.PropertyType == typeof(bool?))
                    {
                        valueString = (bool)value ? "1" : "0";
                        isTypeBool = true;
                    }
                    else if (property.PropertyType == typeof(string))
                    {
                        valueString = string.Format(" '{0}' ", value.ToString());
                    }

                    else
                    {
                        valueString = value.ToString();
                    }

                    filterOptions.Add(new FilterOption
                    {
                        Column = property.Name,
                        Value = valueString,
                        Operator = " = ",
                        ValueType = isTypeBool == true ? "bool" : property.PropertyType.Name.ToLower()
                    });
                }
            }

            return filterOptions.ToArray();
        }

        /// <summary>Adds the parameters.</summary>
        /// <param name="cmd">The command.</param>
        /// <param name="parameters">The parameters.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        private void AddParameters(IDbCommand cmd, object parameters)
        {
            if (parameters is IDictionary<string, object> dictionary)
            {
                // Xử lý parameters dạng Dictionary
                foreach (var item in dictionary)
                {
                    var param = cmd.CreateParameter();
                    param.ParameterName = item.Key.StartsWith("@") ? item.Key : "@" + item.Key;
                    param.Value = Null.GetDBNull(item.Value);
                    cmd.Parameters.Add(param);
                }
            }
            else
            {
                // Xử lý parameters dạng anonymous object
                var properties = parameters.GetType().GetProperties();
                foreach (var prop in properties)
                {
                    var param = cmd.CreateParameter();
                    param.ParameterName = "@" + prop.Name;
                    param.Value = Null.GetDBNull(prop.GetValue(parameters)) ;
                    cmd.Parameters.Add(param);
                }
            }
        }

        /// <summary>Errors the message.</summary>
        /// <param name="ex">The ex.</param>
        /// <param name="commandText">The command text.</param>
        /// <param name="parameters">The parameters.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        private string ErrorMessage(Exception ex, string commandText, object parameters)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Error executing command: {commandText}");

            if (parameters != null)
            {
                sb.AppendLine("Parameters:");
                if (parameters is IDictionary<string, object> dictionary)
                {
                    foreach (var item in dictionary)
                    {
                        sb.AppendLine($"{item.Key} = {item.Value}");
                    }
                }
                else
                {
                    foreach (var prop in parameters.GetType().GetProperties())
                    {
                        sb.AppendLine($"{prop.Name} = {prop.GetValue(parameters)}");
                    }
                }
            }

            sb.AppendLine($"Error: {ex.Message}");
            return sb.ToString();
        }

        #endregion
    }

    /// <summary> Filter Filed column mapping Db column </summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class FilterOption
    {
        public string Column { get; set; }

        /// <summary> value =" = " exam A=B</summary>
        public string Operator { get; set; }
        public string Value { get; set; }
        public string ValueType { get; set; }
        public int OrderValue { get; set; }
    }

    /// <summary> order by Column ASC/DESC </summary>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public class OrderOption
    {
        public string Column { get; set; }
        public string OrderType { get; set; } // ASC, DESC

        public override string ToString()
        {
            return $"{Column} {OrderType}";
        }
    }

}
