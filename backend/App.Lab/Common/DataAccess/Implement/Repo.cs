
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Data;
using System.Text;
using System.Dynamic;
using App.Common.Helper;
using Microsoft.Data.SqlClient;

namespace App.DataAccess
{
    public class Repo : Accessor
    {
        private readonly IUnitOfWork _unitOfWork;

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
        public int ExecuteNonQuery(string spName, params object[] parameterValues)
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
                    return ret;
                }
                else
                    return SqlHelper.ExecuteNonQuery((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
            }
            catch (Exception ex)
            {
                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }
                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public object ExecuteScalar(string spName, params object[] parameterValues)
        {
            IDataReader dr = null;
            object ret = null;
            IDbTransaction trans = null;
            try
            {
                Exec(out dr, out trans, spName, parameterValues);

                if (dr != null)
                {
                    if (dr.Read())
                        ret = dr.GetValue(0);
                    else
                        ret = null;

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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }

            return ret;
        }

        public void ExecuteReader<T>(out T ret, string spName, params object[] parameterValues)
        {
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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public void ExecuteReaderJson<T>(out T ret, string spName, params object[] parameterValues)
        {
            var data = ExecuteScalar(spName, parameterValues);
            if (data == null)
            {
                ret = default;
            }
            else
            {
                ret = JsonSerializer.Deserialize<List<T>>(data.ToString()).FirstOrDefault();
            }
        }

        public void ExecuteReader<T>(out List<T> ret, string spName, params object[] parameterValues)
        {
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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public void ExecuteReaderJson<T>(out List<T> ret, string spName, params object[] parameterValues)
        {
            var data = ExecuteScalar(spName, parameterValues);
            if (data == null)
            {
                ret = default;
            }
            else
            {
                ret = JsonSerializer.Deserialize<List<T>>(data.ToString());
            }
        }

        public void ExecuteReader<T>(out List<T> ret, out int TotalCount, string spName, params object[] parameterValues)
        {
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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public void ExecuteReader<T>(out T ret, List<string> objProperties, string spName, params object[] parameterValues)
        {
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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public void ExecuteReader<T>(out List<T> ret, List<string> objProperties, string spName, params object[] parameterValues)
        {
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
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        public void ExecuteReader<T>(out T ret,string commandText,CommandType commandType = CommandType.StoredProcedure, params object[] parameterValues)
        {
            //if (!string.IsNullOrEmpty(Schema) && commandType == CommandType.StoredProcedure)
            //{
            //    commandText = Schema + "." + commandText;
            //}

            IDataReader dr = null;
            IDbTransaction trans = null;
            ret = default;

            try
            {
                if (commandType == CommandType.StoredProcedure)
                {
                    Exec(out dr, out trans, commandText, parameterValues);
                }
                else // CommandType.Text
                {
                    ExecCommand(out dr, commandText);
                }

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

                throw new Exception(commandText + ": " + ex.ToString());
            }
        }


        public DataSet ExecuteDataset(string spName, params object[] parameterValues)
        {
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
                if (ds != null)
                    ds.Dispose();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception(spName + ": " + ex.ToString());
            }
        }

        private void Exec(out IDataReader dr, out IDbTransaction trans, string spName, params object[] parameterValues)
        {
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                dr = SqlHelper.ExecuteReader((SqlTransaction)trans, spName, parameterValues);
            }
            else
                dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
        }
        public void ExecCommand<T>(out List<T> ret, string sqlCommand)
        {
            IDataReader dr = null;
            IDbTransaction trans = null;
            try
            {
                _ExecCommand(out dr, out trans, sqlCommand, null);
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
        private void _ExecCommand(out IDataReader dr, out IDbTransaction trans, string sqlCommand, SqlParameter[] commandParameters)
        {
            dr = null;
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                dr = SqlHelper.ExecuteReader((SqlTransaction)trans, CommandType.Text, sqlCommand, commandParameters);
            }
            else
            {
                dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), CommandType.Text, sqlCommand, commandParameters);
            }
        }
        //private void ExecComment(out IDataReader dr, out IDbTransaction trans,  string commandText, params object[] parameterValues)
        //{
        //    trans = null;
        //    if (_unitOfWork.GetTransaction() == null)
        //    {
        //        trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
        //        dr = SqlHelper.ExecuteReader((SqlTransaction)trans, CommandType.Text, commandText, parameterValues);
        //    }
        //    else
        //        dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), commandText, parameterValues);
        //}

        private void ExecDataset(out DataSet ds, out IDbTransaction trans, string spName, params object[] parameterValues)
        {
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                ds = SqlHelper.ExecuteDataset((SqlTransaction)trans, spName, parameterValues);
            }
            else
                ds = SqlHelper.ExecuteDataset((SqlTransaction)_unitOfWork.GetTransaction(), spName, parameterValues);
        }

        private void ExecCommand(out IDataReader dr, out IDbTransaction trans, string sqlCommand, SqlParameter[] commandParameters)
        {
            trans = null;
            if (_unitOfWork.GetTransaction() == null)
            {
                trans = _unitOfWork.GetDbContext().Connection.BeginTransaction();
                dr = SqlHelper.ExecuteReader((SqlTransaction)trans, CommandType.Text, sqlCommand, commandParameters);
            }
            else
            {
                dr = SqlHelper.ExecuteReader((SqlTransaction)_unitOfWork.GetTransaction(), CommandType.Text, sqlCommand, commandParameters);
            }
        }

        public void GetTableData<T>(out List<T> ret, string tableName, string[] lstColumn = null,
            FilterOption[] lstFilterOption = null, OrderOption[] lstOrderOption = null)
        {
            SqlParameter[] commandParameters = null;
            //SqlParameter[] commandParameters = new SqlParameter[1];

            var queryBuilder = new StringBuilder();
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
                    queryBuilder.Append($" AND {filter.Column} {filter.Operator} {filter.Value} ");
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
                ExecCommand(out dr, out trans, sqlCommand, commandParameters);

                ret = CBO.FillList<T>(dr);

                if (trans != null)
                {
                    trans.Commit();
                    trans.Dispose();
                }
            }
            catch (Exception ex)
            {
                if (dr != null)
                    dr.Close();

                if (trans != null)
                {
                    trans.Rollback();
                    trans.Dispose();
                }

                throw new Exception("sqlCommand: " + sqlCommand + ": " + ex.ToString());
            }
        }

        #endregion


        public List<dynamic> ToDynamic(DataTable dt)
        {
            var dynamicDt = new List<dynamic>();
            foreach (DataRow row in dt.Rows)
            {
                dynamic dyn = new ExpandoObject();
                dynamicDt.Add(dyn);
                foreach (DataColumn column in dt.Columns)
                {
                    var dic = (IDictionary<string, object>)dyn;
                    dic[column.ColumnName] = row[column];
                }
            }
            return dynamicDt;
        }

        public List<Dictionary<string, object>> ToDictionary(DataTable dt)
        {
            var columns = dt.Columns.Cast<DataColumn>();
            var Temp = dt.AsEnumerable().Select(dataRow => columns.Select(column =>
                                 new { Column = column.ColumnName, Value = dataRow[column] })
                             .ToDictionary(data => data.Column, data => data.Value)).ToList();
            return Temp.ToList();
        }

        public Type GetTypeByName(string name)
        {
            return
                AppDomain.CurrentDomain.GetAssemblies()
                    .Reverse()
                    .Select(assembly => assembly.GetType(name))
                    .FirstOrDefault(t => t != null)
                // Safely delete the following part
                // if you do not want fall back to first partial result
                ??
                AppDomain.CurrentDomain.GetAssemblies()
                    .Reverse()
                    .SelectMany(assembly => assembly.GetTypes())
                    .FirstOrDefault(t => t.Name.Contains(name));
        }
    }

    public class FilterOption
    {
        public string Column { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
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
