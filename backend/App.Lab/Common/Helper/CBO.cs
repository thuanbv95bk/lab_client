// 
// DotNetNuke® - http://www.dotnetnuke.com
// Copyright (c) 2002-2006
// by Perpetual Motion Interactive Systems Inc. ( http://www.perpetualmotion.ca )
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions 
// of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.
// 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Diagnostics;
using System.Reflection;
using Microsoft.VisualBasic;
using System.Xml;
using System.Xml.Serialization;
using System.Data;
using System.Collections;
using System.Dynamic;

namespace App.Common.Helper
{

    // *********************************************************************
    // 
    // CBO Class
    // 
    // Class that hydrates custom business objects with data. Please
    // note that this utility class can only be used on objects with "simple"
    // data types. If the object contains "complex" data types such as 
    // ArrayLists, HashTables, Custom Objects, etc... then the developer 
    // will need to write custom code for the hydration of these "complex" 
    // data types.
    // 
    // *********************************************************************

    public class CBO
    {
        public static ArrayList GetPropertyInfo(Type objType)
        {

            ArrayList objProperties;

            objProperties = new ArrayList();
            //PropertyInfo objProperty;
            foreach (var objProperty in objType.GetProperties())
                objProperties.Add(objProperty);
            return objProperties;
        }

        private static int[] GetOrdinals(ArrayList objProperties, IDataReader dr)
        {
            int[] arrOrdinals = new int[objProperties.Count + 1];
            int intProperty;

            if (dr != null)
            {
                for (intProperty = 0; intProperty <= objProperties.Count - 1; intProperty++)
                {
                    arrOrdinals[intProperty] = -1;
                    try
                    {
                        arrOrdinals[intProperty] = dr.GetOrdinal(((PropertyInfo)objProperties[intProperty]).Name);
                    }
                    catch
                    {
                    }
                }
            }

            return arrOrdinals;
        }

        private static int[] GetOrdinals(List<string> objProperties, IDataReader dr)
        {
            int[] arrOrdinals = new int[objProperties.Count + 1];
            int intProperty;

            if (dr != null)
            {
                for (intProperty = 0; intProperty <= objProperties.Count - 1; intProperty++)
                {
                    arrOrdinals[intProperty] = -1;
                    try
                    {
                        arrOrdinals[intProperty] = dr.GetOrdinal(objProperties[intProperty]);
                    }
                    catch
                    {
                    }
                }
            }

            return arrOrdinals;
        }

        private static object CreateObject(IDataReader dr, List<string> objProperties, int[] arrOrdinals)
        {
            object objValue;
            int intProperty;

            dynamic objObject = new System.Dynamic.ExpandoObject();
            IDictionary<string, object> underlyingObject = objObject;

            for (intProperty = 0; intProperty <= objProperties.Count - 1; intProperty++)
            {
                string properties = objProperties[intProperty];
                if (arrOrdinals[intProperty] != -1)
                {
                    objValue = dr.GetValue(arrOrdinals[intProperty]);
                    if (Information.IsDBNull(objValue))
                        underlyingObject.Add(properties, null);
                    else
                    {
                        try
                        {
                            underlyingObject.Add(properties, objValue);
                        }
                        catch
                        {
                            underlyingObject.Add(properties, null);
                        }
                    }
                }
            }
            return objObject;
        }

        private static object CreateObject(Type objType, IDataReader dr, ArrayList objProperties, int[] arrOrdinals)
        {
            PropertyInfo objPropertyInfo;
            object objValue;
            Type objPropertyType = null;
            int intProperty;

            object objObject = Activator.CreateInstance(objType);

            // fill object with values from datareader
            for (intProperty = 0; intProperty <= objProperties.Count - 1; intProperty++)
            {
                objPropertyInfo = (PropertyInfo)objProperties[intProperty];
                if (objPropertyInfo.CanWrite)
                {
                    if (arrOrdinals[intProperty] != -1)
                    {
                        objValue = dr.GetValue(arrOrdinals[intProperty]);
                        if (Information.IsDBNull(objValue))
                            // translate Null value
                            objPropertyInfo.SetValue(objObject, Null.SetNull(objPropertyInfo), null/* TODO Change to default(_) if this is not a reference type */);
                        else
                            try
                            {
                                // try implicit conversion first
                                objPropertyInfo.SetValue(objObject, objValue, null);
                            }
                            catch
                            {
                                // business object info class member data type does not match datareader member data type
                                objPropertyType = objPropertyInfo.PropertyType;
                                try
                                {
                                    // need to handle enumeration conversions differently than other base types
                                    if (objPropertyType.BaseType.Equals(typeof(System.Enum)))
                                    {
                                        // check if value is numeric and if not convert to integer ( supports databases like Oracle )
                                        if (Information.IsNumeric(objValue))
                                            ((PropertyInfo)objProperties[intProperty]).SetValue(objObject, System.Enum.ToObject(objPropertyType, Convert.ToInt32(objValue)), null);
                                        else
                                            ((PropertyInfo)objProperties[intProperty]).SetValue(objObject, System.Enum.ToObject(objPropertyType, objValue), null);
                                    }
                                    else
                                        // try explicit conversion
                                        objPropertyInfo.SetValue(objObject, Convert.ChangeType(objValue, objPropertyType), null);
                                }
                                catch
                                {
                                    if (objPropertyType.Name == "Boolean")
                                        objPropertyInfo.SetValue(objObject, System.Convert.ToBoolean(objValue), null);
                                    else if (objPropertyType.BaseType.Name == "Enum")
                                        objPropertyInfo.SetValue(objObject, Enum.Parse(objPropertyType, objValue.ToString(), true), null);
                                    else
                                        objPropertyInfo.SetValue(objObject, Convert.ChangeType(objValue, objPropertyType), null);
                                }
                            }
                    }
                    else
                    {
                    }
                }
            }
            return objObject;
        }

        public static T FillObject<T>(IDataReader dr)
        {
            Type objType = typeof(T);
            return (T)FillObject(dr, objType, true);
        }

        public static T FillObject<T>(IDataReader dr, List<string> objProperties)
        {
            return (T)FillObject(dr, objProperties, true);
        }


        public static object FillObject(IDataReader dr, Type objType)
        {
            return FillObject(dr, objType, true);
        }

        public static object FillObject(IDataReader dr, Type objType, bool ManageDataReader)
        {
            object objFillObject;

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);

            bool Continue;
            if (ManageDataReader)
            {
                Continue = false;
                // read datareader
                if (dr.Read())
                    Continue = true;
            }
            else
                Continue = true;

            if (Continue)
                // create custom business object
                objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
            else
                objFillObject = null;

            if (ManageDataReader)
            {
                // close datareader
                if (dr != null)
                    dr.Close();
            }

            return objFillObject;
        }

        public static object FillObject(IDataReader dr, List<string> objProperties, bool ManageDataReader)
        {
            object objFillObject;

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);

            bool Continue;
            if (ManageDataReader)
            {
                Continue = false;
                // read datareader
                if (dr.Read())
                    Continue = true;
            }
            else
                Continue = true;

            if (Continue)
                // create custom business object
                objFillObject = CreateObject(dr, objProperties, arrOrdinals);
            else
                objFillObject = null;

            if (ManageDataReader)
            {
                // close datareader
                if (dr != null)
                    dr.Close();
            }

            return objFillObject;
        }

        public static ArrayList FillCollection(IDataReader dr, Type objType)
        {
            ArrayList objFillCollection = new ArrayList();
            object objFillObject;

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);

            // iterate datareader
            while (dr.Read())
            {
                // fill business object
                objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                // add to collection
                objFillCollection.Add(objFillObject);
            }

            // close datareader
            if (dr != null)
                dr.Close();

            return objFillCollection;
        }

        public static List<T> FillList<T>(IDataReader dr, string fieldname)
        {
            List<T> objFillCollection = new List<T>();
            object objFillObject;

            Type objType = typeof(T);
            T nullofT = (T)Null.GetNull<T>();

            // get properties for type
            //ArrayList objProperties = GetPropertyInfo(objType);

            // get ordinal positions in datareader
            //int[] arrOrdinals = GetOrdinals(objProperties, dr);

            // iterate datareader
            while (dr.Read())
            {
                // fill business object
                //objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                object objValue = dr.GetValue(dr.GetOrdinal(fieldname));
                objFillCollection.Add(Null.DB_GetValue<T>(objValue, nullofT));
                // add to collection

            }

            // close datareader
            if (dr != null)
                dr.Close();

            return objFillCollection;
        }

        public static List<T> FillList<T>(IDataReader dr, List<string> objProperties)
        {
            var objFillCollection = new List<T>();
            object objFillObject;

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);

            // iterate datareader
            try
            {
                while (dr.Read())
                {
                    // fill business object
                    objFillObject = CreateObject(dr, objProperties, arrOrdinals);
                    // add to collection
                    objFillCollection.Add((T)objFillObject);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // close datareader
                if (dr != null)
                {
                    dr.Close();
                    //dr.Dispose();
                }

            }

            return objFillCollection;
        }

        public static List<T> FillList<T>(IDataReader dr)
        {
            var objFillCollection = new List<T>();
            object objFillObject;

            Type objType = typeof(T);

            // iterate datareader
            try
            {
                if (objType == typeof(string))
                {
                    while (dr.Read())
                    {
                        objFillCollection.Add((T)dr.GetValue(0));
                    }
                }
                else
                {
                    // get properties for type
                    ArrayList objProperties = GetPropertyInfo(objType);

                    // get ordinal positions in datareader
                    int[] arrOrdinals = GetOrdinals(objProperties, dr);

                    while (dr.Read())
                    {
                        // fill business object
                        objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                        // add to collection
                        objFillCollection.Add((T)objFillObject);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                dr?.Close();
            }

            return objFillCollection;
        }

        public static Tuple<List<T>, List<A>> FillTwoList<T, A>(IDataReader dr)
        {
            List<T> objFillCollection = new List<T>();
            List<A> objFillCollection2 = new List<A>();
            object objFillObject;
            object objFillObject2;

            Type objType = typeof(T);
            Type objType2 = typeof(A);

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);
            ArrayList objProperties2 = GetPropertyInfo(objType2);

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);
            int[] arrOrdinals2 = GetOrdinals(objProperties2, dr);

            // iterate datareader
            try
            {
                while (dr.Read())
                {
                    // fill business object
                    objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                    // add to collection
                    objFillCollection.Add((T)objFillObject);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    // fill business object
                    objFillObject2 = CreateObject(objType2, dr, objProperties2, arrOrdinals2);
                    // add to collection
                    objFillCollection2.Add((A)objFillObject2);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // close datareader
                if (dr != null)
                {
                    dr.Close();
                    //dr.Dispose();
                }

            }
            Tuple<List<T>, List<A>> result = new Tuple<List<T>, List<A>>(objFillCollection, objFillCollection2);
            return result;
        }

        public static Tuple<List<T>, List<A>, List<B>> FillThreeList<T, A, B>(IDataReader dr)
        {
            List<T> objFillCollection = new List<T>();
            List<A> objFillCollection2 = new List<A>();
            List<B> objFillCollection3 = new List<B>();

            object objFillObject;
            object objFillObject2;
            object objFillObject3;

            Type objType = typeof(T);
            Type objType2 = typeof(A);
            Type objType3 = typeof(B);

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);
            ArrayList objProperties2 = GetPropertyInfo(objType2);
            ArrayList objProperties3 = GetPropertyInfo(objType3);

            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);
            int[] arrOrdinals2 = GetOrdinals(objProperties2, dr);
            int[] arrOrdinals3 = GetOrdinals(objProperties3, dr);

            // iterate datareader
            try
            {
                while (dr.Read())
                {
                    // fill business object
                    objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                    // add to collection
                    objFillCollection.Add((T)objFillObject);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    // fill business object
                    objFillObject2 = CreateObject(objType2, dr, objProperties2, arrOrdinals2);
                    // add to collection
                    objFillCollection2.Add((A)objFillObject2);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    // fill business object
                    objFillObject3 = CreateObject(objType3, dr, objProperties3, arrOrdinals3);
                    // add to collection
                    objFillCollection3.Add((B)objFillObject3);
                }


            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // close datareader
                if (dr != null)
                {
                    dr.Close();
                    //dr.Dispose();
                }

            }
            Tuple<List<T>, List<A>, List<B>> result = new Tuple<List<T>, List<A>, List<B>>(objFillCollection, objFillCollection2, objFillCollection3);
            return result;
        }

        public static List<T> FillList<T>(IDataReader dr, string total_record_field, out int total_record)
        {
            List<T> objFillCollection = new List<T>();
            object objFillObject;

            Type objType = typeof(T);

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);
            total_record = -1;
            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);
            int iTotalOrdinal = dr.GetOrdinal(total_record_field);
            if (iTotalOrdinal < 0)
                throw new Exception(string.Format("Total column {0} not found", total_record_field));
            // iterate datareader
            while (dr.Read())
            {
                // fill business object
                objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                // add to collection
                objFillCollection.Add((T)objFillObject);
                if (total_record < 0)
                    total_record = (int)dr.GetValue(iTotalOrdinal); //gan total record
            }

            // close datareader
            if (dr != null)
                dr.Close();

            return objFillCollection;
        }


        public static Tuple<List<T>, List<A>> FillTwoList<T, A>(IDataReader dr, string total_record_field, out int total_record)
        {
            List<T> objFillCollection = new List<T>();

            object objFillObject;

            Type objType = typeof(T);

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);
            total_record = 0;
            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);
            int iTotalOrdinal = dr.GetOrdinal(total_record_field);
            if (iTotalOrdinal < 0)
                throw new Exception(string.Format("Total column {0} not found", total_record_field));
            // iterate datareader
            while (dr.Read())
            {
                // fill business object
                objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                // add to collection
                objFillCollection.Add((T)objFillObject);
                total_record = (int)dr.GetValue(iTotalOrdinal); //gan total record
            }

            dr.NextResult();

            List<A> addons = new List<A>();
            Type objTypeAddons = typeof(A);
            object objFillAddons;

            // get properties for type
            ArrayList objPropertiesAddons = GetPropertyInfo(objTypeAddons);
            int[] arrOrdinalsAddons = GetOrdinals(objPropertiesAddons, dr);
            while (dr.Read())
            {
                // fill business object
                objFillAddons = CreateObject(objType, dr, objPropertiesAddons, arrOrdinalsAddons);
                // add to collection
                addons.Add((A)objFillAddons);
            }

            // close datareader
            if (dr != null)
                dr.Close();
            Tuple<List<T>, List<A>> result = new Tuple<List<T>, List<A>>(objFillCollection, addons);
            return result;
        }


        public static IList FillCollection(IDataReader dr, Type objType, ref IList objToFill)
        {
            object objFillObject;
            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);
            // get ordinal positions in datareader
            int[] arrOrdinals = GetOrdinals(objProperties, dr);

            // iterate datareader
            while (dr.Read())
            {
                // fill business object
                objFillObject = CreateObject(objType, dr, objProperties, arrOrdinals);
                // add to collection
                objToFill.Add(objFillObject);
            }

            // close datareader
            if (dr != null)
                dr.Close();

            return objToFill;
        }

        public static object InitializeObject(object objObject, Type objType)
        {
            PropertyInfo objPropertyInfo;
            object objValue;
            int intProperty;

            // get properties for type
            ArrayList objProperties = GetPropertyInfo(objType);

            // initialize properties
            for (intProperty = 0; intProperty <= objProperties.Count - 1; intProperty++)
            {
                objPropertyInfo = (PropertyInfo)objProperties[intProperty];
                if (objPropertyInfo.CanWrite)
                {
                    objValue = Null.SetNull(objPropertyInfo);
                    objPropertyInfo.SetValue(objObject, objValue, null);
                }
            }

            return objObject;
        }

        public static object CloneObject(object objObject)
        {
            Type objType = objObject.GetType();
            // create instance for type
            object objReturn = Activator.CreateInstance(objType);
            // copy all property to new object
            foreach (PropertyInfo objProperty in objType.GetProperties())
            {
                if (objProperty.CanWrite)
                    objProperty.SetValue(objReturn, objProperty.GetValue(objObject, null), null);
            }

            return objReturn;
        }

        public static void MapObject<T>(object SourceObject, ref T DesObject)
        {
            Type objDesType = DesObject.GetType();
            Type objSrcType = SourceObject.GetType();
            // copy all property to new object
            PropertyInfo inf = null;
            foreach (PropertyInfo objProperty in objDesType.GetProperties())
            {
                if (objProperty.CanWrite)
                {
                    //kiem tra xem co property trung ten va trung type thi map vao 
                    inf = objSrcType.GetProperties().Where(x => x.Name == objProperty.Name && x.PropertyType == objProperty.PropertyType).FirstOrDefault();
                    if (inf != null)
                    {
                        objProperty.SetValue(DesObject, inf.GetValue(SourceObject, null), null);
                    }
                }
            }
        }

        public static void MapList<T>(List<object> sourceList, ref List<T> destinationList)
        {
            foreach (object sourceObject in sourceList)
            {
                T destinationObject = Activator.CreateInstance<T>();
                MapObject(sourceObject, ref destinationObject);
                destinationList.Add(destinationObject);
            }
        }

        public static XmlDocument Serialize(object objObject)
        {
            XmlSerializer objXmlSerializer = new XmlSerializer(objObject.GetType());
            StringBuilder objStringBuilder = new StringBuilder();
            TextWriter objTextWriter = new StringWriter(objStringBuilder);

            objXmlSerializer.Serialize(objTextWriter, objObject);

            StringReader objStringReader = new StringReader(objTextWriter.ToString());
            DataSet objDataSet = new DataSet();

            objDataSet.ReadXml(objStringReader);

            XmlDocument xmlSerializedObject = new XmlDocument();

            xmlSerializedObject.LoadXml(objDataSet.GetXml());

            return xmlSerializedObject;
        }

        public static DateTime? GetDateFromString(string date)
        {
            try
            {
                return new DateTime(Convert.ToInt32(date.Substring(0, 4)), Convert.ToInt32(date.Substring(4, 2)), Convert.ToInt32(date.Substring(6, 2)));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static ExpandoObject DeepCopy(ExpandoObject original)
        {
            var clone = new ExpandoObject();

            var _original = (IDictionary<string, object>)original;
            var _clone = (IDictionary<string, object>)clone;

            foreach (var kvp in _original)
                _clone.Add(kvp.Key, kvp.Value is ExpandoObject ? DeepCopy((ExpandoObject)kvp.Value) : kvp.Value);

            return clone;
        }
    }

}
