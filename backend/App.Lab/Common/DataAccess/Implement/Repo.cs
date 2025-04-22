
using App.Common.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;
using System.Text.Json;


namespace App.DataAccess
{
    public class Repo : Accessor
    {
        private readonly IUnitOfWork _unitOfWork;
        public string Schema;

        private static readonly JsonSerializerOptions jsonSerializeroptions = new JsonSerializerOptions
        {
            Converters =
        {
                new BooleanConverter(),
                new NullableBooleanConverter()
        },
            PropertyNameCaseInsensitive = true
        };

        public Repo(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Repo(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork) : base(httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
        }

        public string GetDbInfo()
        {
            return _unitOfWork.GetDbContext().Connection.ConnectionString;
        }

        #region "data helper"
        public void ExecNonQuery(string spName, params object[] parameterValues)
        {
            //if (!string.IsNullOrEmpty(Schema))
            //    spName = $"{Schema}.{spName}";

            if (_unitOfWork.GetDbContext().IsSqlServer())
            {
                IDbTransaction trans = null;
                try
                {
                    if (_unitOfWork.GetTransaction() == null)
                    {
                        trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                        var ret = SqlHelper.ExecuteNonQuery((SqlTransaction)trans, spName, parameterValues);
                        trans.Commit();
                        trans.Dispose();
                    }
                    else
                    {
                        SqlHelper.ExecuteNonQuery((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
                    }
                }
                catch (Exception ex)
                {
                    if (trans != null)
                    {
                        trans.Rollback();
                        trans.Dispose();
                    }
                    throw new Exception(ErrorMessage(ex, spName, parameterValues));
                }
            }
        }
        //public void ExecNonQuery(string spName, params object[] parameterValues)
        //{
        //    if (!string.IsNullOrEmpty(Schema))
        //        spName = $"{Schema}.{spName}";

        //    if (_unitOfWork.GetDbContext().IsSqlServer())
        //    {
        //        IDbTransaction trans = null;
        //        try
        //        {
        //            if (_unitOfWork.GetTransaction() == null)
        //            {
        //                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
        //                var ret = SqlHelper.ExecuteNonQuery((SqlTransaction)trans, spName, parameterValues);
        //                trans.Commit();
        //                trans.Dispose();
        //            }
        //            else
        //            {
        //                SqlHelper.ExecuteNonQuery((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            if (trans != null)
        //            {
        //                trans.Rollback();
        //                trans.Dispose();
        //            }
        //            throw new Exception(ErrorMessage(ex, spName, parameterValues));
        //        }
        //    }
        //}
        public object ExecuteScalar(string spName, params object[] parameterValues)
        {
            //if (!string.IsNullOrEmpty(Schema))
            //    spName = $"{Schema}.{spName}";

            object ret = null;
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                if (dr != null)
                {
                    ret = CBO.FillString(dr);
                    dr.Close();
                }

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }

            return ret;
        }

        public T ExecuteScalarAs<T>(string spName, params object[] parameterValues)
        {


            Type type = typeof(T);

            var allowedTypes = new[]
            {
                typeof(bool), typeof(byte), typeof(sbyte), typeof(short), typeof(ushort),
                typeof(int), typeof(uint), typeof(long), typeof(ulong),
                typeof(float), typeof(double), typeof(decimal), typeof(char),
                typeof(string), typeof(DateTime)
            };

            if (Array.IndexOf(allowedTypes, type) < 0)
            {
                throw new InvalidOperationException($"The type {type} is not a supported primitive type.");
            }

            var retstr = ExecuteScalar(spName, parameterValues);
            var ret = (T)Convert.ChangeType(retstr, typeof(T));
            return ret;
        }

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

       


        public void ExecuteReader<T>(out T ret, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                ret = CBO.FillObject<T>(dr);

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        public void ExecuteReaderJson<T>(out T ret, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            var data = ExecuteScalar(spName, parameterValues);
            if (string.IsNullOrEmpty(data?.ToString()))
                ret = default;
            else
                ret = JsonSerializer.Deserialize<T>(data.ToString(), jsonSerializeroptions);
        }

        public void ExecuteReader<T>(out List<T> ret, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        public void ExecuteReaderJson<T>(out List<T> ret, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            var data = ExecuteScalar(spName, parameterValues);
            if (string.IsNullOrEmpty(data?.ToString()))
                ret = default;
            else
                ret = JsonSerializer.Deserialize<List<T>>(data.ToString(), jsonSerializeroptions);
        }

        public void ExecuteReader<T>(out List<T> ret, out int TotalCount, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                ret = CBO.FillList<T>(dr, "TotalCount", out TotalCount);

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        public void ExecuteReader<T>(out T ret, List<string> objProperties, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                ret = CBO.FillObject<T>(dr, objProperties);

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        public void ExecuteReader<T>(out List<T> ret, List<string> objProperties, string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                ret = CBO.FillList<T>(dr, objProperties);

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
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        public DataSet ExecuteDataset(string spName, params object[] parameterValues)
        {
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

            DataSet ds = null;
            IDbTransaction trans = null;
            try
            {
                ExecDataset(out ds, out trans, spName, parameterValues);

                if (trans != null)
                {
                    trans.Commit();
                    trans.Dispose();
                }

                return ds;
            }
            catch (Exception ex)
            {
                ds?.Dispose();
                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }
                throw new Exception(ErrorMessage(ex, spName, parameterValues));
            }
        }

        private string ErrorMessage(Exception ex, string spName, params object[] parameterValues)
        {
            return ">>>>>>> " + spName + " " + string.Join(", ", parameterValues.Select(p =>
                    string.IsNullOrEmpty(p?.ToString()) ? "NULL" :
                    p is string ? $"'{p}'" :
                    p is DateTime dt ? $"'{dt:yyyy-MM-dd HH:mm:ss}'" :
                    p.ToString())) + " >>>>>>> "
                + ex.ToString() + " >>>>>>>";
        }

        private void Exec(out IDataReader dr, out IDbTransaction trans, string spName, params object[] parameterValues)
        {
            dr = null;
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)trans, spName, parameterValues);

            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);

            }
        }

        private void ExecDataset(out DataSet ds, out IDbTransaction trans, string spName, params object[] parameterValues)
        {
            ds = null;
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    ds = SqlHelper.ExecuteDataset((SqlTransaction)trans, spName, parameterValues);
            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    ds = SqlHelper.ExecuteDataset((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
            }
        }

        private void _ExecCommand(out IDataReader dr, out IDbTransaction trans, string sqlCommand, SqlParameter[] commandParameters)
        {
            dr = null;
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)trans, CommandType.Text, sqlCommand, commandParameters);

                else
                    throw new NotImplementedException();
            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), CommandType.Text, sqlCommand, commandParameters);

                else
                    throw new NotImplementedException();
            }
        }

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

        public void ExecCommand(string sqlCommand)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, sqlCommand, null);

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
                    //else if (property.PropertyType == typeof(int))
                    //{
                    //    valueString = string.Format(" '{0}' ", value.ToString());
                    //}
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

        private void AddParameters(IDbCommand cmd, object parameters)
        {
            if (parameters is IDictionary<string, object> dictionary)
            {
                // Xử lý parameters dạng Dictionary
                foreach (var item in dictionary)
                {
                    var param = cmd.CreateParameter();
                    param.ParameterName = item.Key.StartsWith("@") ? item.Key : "@" + item.Key;
                    param.Value = item.Value ?? DBNull.Value;
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
                    param.Value = prop.GetValue(parameters) ?? DBNull.Value;
                    cmd.Parameters.Add(param);
                }
            }
        }

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

    public class FilterOption
    {
        public string Column { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
        public string ValueType { get; set; }
        public int OrderValue { get; set; }
    }

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
