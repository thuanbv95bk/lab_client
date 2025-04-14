
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Data;
using System.Text;
using App.Common.Helper;
using Microsoft.Data.SqlClient;
using System.Xml.Linq;
using System.Security.Cryptography;

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
            if (!string.IsNullOrEmpty(Schema))
                spName = $"{Schema}.{spName}";

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
            else if (_unitOfWork.GetDbContext().IsOracle())
            {
                IDbTransaction trans = null;
                try
                {
                    if (_unitOfWork.GetTransaction() == null)
                    {
                        //trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                        //var ret = OracleHelper.ExecuteNonQuery((OracleTransaction)trans, spName, parameterValues);
                        //trans.Commit();
                        //trans.Dispose();
                    }
                    else
                    {
                        //OracleHelper.ExecuteNonQuery((OracleTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
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
            else if (_unitOfWork.GetDbContext().IsMySql())
            {
                IDbTransaction trans = null;
                try
                {
                    if (_unitOfWork.GetTransaction() == null)
                    {
                        //trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                        //var ret = MySqlHelper.ExecuteNonQuery((MySqlTransaction)trans, spName, parameterValues);
                        //trans.Commit();
                        //trans.Dispose();
                    }
                    else
                    {
                        //MySqlHelper.ExecuteNonQuery((MySqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
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
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    dr = OracleHelper.ExecuteReader((OracleTransaction)trans, spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsMySql())
                //    dr = MySqlHelper.ExecuteReader((MySqlTransaction)trans, spName, parameterValues);
            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    dr = OracleHelper.ExecuteReader((OracleTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsMySql())
                //    dr = MySqlHelper.ExecuteReader((MySqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
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
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    ds = OracleHelper.ExecuteDataset((OracleTransaction)trans, spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsMySql())
                //    ds = MySqlHelper.ExecuteDataset((MySqlTransaction)trans, spName, parameterValues);
            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    ds = SqlHelper.ExecuteDataset((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    ds = OracleHelper.ExecuteDataset((OracleTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
                //else if (_unitOfWork.GetDbContext().IsMySql())
                //    ds = MySqlHelper.ExecuteDataset((MySqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
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
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    dr = OracleHelper.ExecuteReader((OracleTransaction)trans, CommandType.Text, sqlCommand);
                else
                    throw new NotImplementedException();
            }
            else
            {
                if (_unitOfWork.GetDbContext().IsSqlServer())
                    dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), CommandType.Text, sqlCommand, commandParameters);
                //else if (_unitOfWork.GetDbContext().IsOracle())
                //    dr = OracleHelper.ExecuteReader((OracleTransaction)trans, CommandType.Text, sqlCommand);
                else
                    throw new NotImplementedException();
            }
        }

        public void GetTableData<T>(out List<T> ret, string tableName, string[] lstColumn = null, FilterOption[] lstFilterOption = null, OrderOption[] lstOrderOption = null) 
        { 

            if (!string.IsNullOrEmpty(Schema))
                tableName = $"[{Schema}.{tableName}]";

            SqlParameter[] commandParameters = null;
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append(" SELECT ");
            if (lstColumn == null || lstColumn.Length == 0)
            {
                stringBuilder.Append(" * ");
            }
            else if (lstColumn.Length == 1)
            {
                stringBuilder.Append(string.Join(" , ", lstColumn));
            }

            StringBuilder stringBuilder2 = stringBuilder;
            StringBuilder stringBuilder3 = stringBuilder2;
            StringBuilder.AppendInterpolatedStringHandler handler = new StringBuilder.AppendInterpolatedStringHandler(7, 1, stringBuilder2);
            handler.AppendLiteral(" FROM ");
            handler.AppendFormatted(tableName);
            handler.AppendLiteral(" ");
            stringBuilder3.Append(ref handler);
            if (lstFilterOption != null && lstFilterOption.Length != 0)
            {
                stringBuilder.Append(" WHERE 1=1 ");
                foreach (FilterOption filterOption in lstFilterOption)
                {
                    stringBuilder2 = stringBuilder;
                    StringBuilder stringBuilder4 = stringBuilder2;
                    handler = new StringBuilder.AppendInterpolatedStringHandler(8, 3, stringBuilder2);
                    handler.AppendLiteral(" AND ");
                    handler.AppendFormatted(filterOption.Column);
                    handler.AppendLiteral(" = ");
                    handler.AppendFormatted(filterOption.Value);
                    handler.AppendLiteral(" ");
                    stringBuilder4.Append(ref handler);
                }
            }

            if (lstOrderOption != null && lstOrderOption.Length != 0)
            {
                stringBuilder.Append(" ORDER BY ");
                stringBuilder.Append(string.Join(" , ", lstOrderOption.Select((OrderOption x) => x.ToString())));
            }

            string text = stringBuilder.ToString();
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, text, commandParameters);
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

                throw new Exception("sqlCommand: " + text + ": " + ex.ToString());
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
                    if (property.PropertyType == typeof(bool) || property.PropertyType == typeof(bool?))
                    {
                        valueString = (bool)value ? "1" : "0";
                    }
                    else if (property.PropertyType == typeof(string))
                    {
                        valueString = string.Format(" '{0}' ", value.ToString()) ;
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
                        ValueType = property.PropertyType.Name.ToLower()
                    });
                }
            }

            return filterOptions.ToArray();
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
