using System.Reflection;
namespace App.Common.Helper
{
    public class Null
    {
        //  define application encoded null values 

        #region "property"
        public static short NullShort
        {
            get
            {
                return short.MinValue;
            }
        }

        public static int NullInteger
        {
            get
            {
                return int.MinValue;
            }
        }

        public static long NullLong
        {
            get
            {
                return long.MinValue;
            }
        }

        public static float NullSingle
        {
            get
            {
                return Single.MinValue;
            }
        }

        public static double NullDouble
        {
            get
            {
                return Double.MinValue;
            }
        }

        public static Decimal NullDecimal
        {
            get
            {
                return Decimal.MinValue;
            }
        }

        public static DateTime NullDate
        {
            get
            {
                return DateTime.MinValue;
            }
        }

        public static string NullString
        {
            get
            {
                return "";
            }
        }

        public static bool NullBoolean
        {
            get
            {
                return false;
            }
        }

        public static Guid NullGuid
        {
            get
            {
                return Guid.Empty;
            }
        }
        #endregion

        #region "funtion"

        public static bool IsNull(object objField)
        {
            if (objField == null)
                return true;

            if (objField.GetType().Equals(typeof(short)))
            {
                return ((short)objField == NullShort);
            }
            else
                if (objField.GetType().Equals(typeof(int)))
            {
                return ((int)objField == NullInteger);
            }
            else
                    if (objField.GetType().Equals(typeof(long)))
            {
                return ((long)objField == NullLong);
            }
            else
                        if (objField.GetType().Equals(typeof(float)))
            {
                return ((float)objField == NullSingle);
            }
            else
                            if (objField.GetType().Equals(typeof(double)))
            {
                return ((double)objField == NullDouble);
            }
            else
                                if (objField.GetType().Equals(typeof(Decimal)))
            {
                return ((Decimal)objField == NullDecimal);
            }
            else
                                    if (objField.GetType().Equals(typeof(DateTime)))
            {
                return (((DateTime)objField == NullDate || (DateTime)objField == new DateTime(1900, 1, 1)));
            }
            else
                                        if (objField.GetType().Equals(typeof(string)))
            {
                return ((string)objField == NullString);
            }
            else
                                            if (objField.GetType().Equals(typeof(Guid)))
            {
                return ((Guid)objField == NullGuid);
            }
            return false;
        }

        // sets a field to an application encoded null value ( used in BLL layer )
        public static object SetNull(PropertyInfo objPropertyInfo)
        {
            switch (objPropertyInfo.PropertyType.ToString().ToLower())
            {
                case "system.int16":
                    {
                        return NullShort;
                        break;
                    }

                case "system.int32":
                    {
                        return NullInteger;
                        break;
                    }

                case "system.int64":
                    {
                        return NullLong;
                        break;
                    }

                case "system.single":
                    {
                        return NullSingle;
                        break;
                    }

                case "system.double":
                    {
                        return NullDouble;
                        break;
                    }

                case "system.decimal":
                    {
                        return NullDecimal;
                        break;
                    }

                case "system.datetime":
                    {
                        return NullDate;
                        break;
                    }

                case "system.string":
                case "system.char":
                    {
                        return NullString;
                        break;
                    }

                case "system.boolean":
                    {
                        return NullBoolean;
                        break;
                    }

                case "system.guid":
                    {
                        return NullGuid;
                        break;
                    }

                default:
                    {
                        // Enumerations default to the first entry
                        Type pType = objPropertyInfo.PropertyType;
                        if (pType.BaseType.Equals(typeof(System.Enum)))
                        {
                            System.Array objEnumValues = System.Enum.GetValues(pType);
                            Array.Sort(objEnumValues);
                            return System.Enum.ToObject(pType, objEnumValues.GetValue(0));
                        }
                        else
                            return null;
                        break;
                    }
            }
        }

        public static object GetNull<T>()
        {
            if (Nullable.GetUnderlyingType(typeof(T)) != null)
            {
                // It's nullable
                return null;
            }
            else
            {
                switch (typeof(T).FullName.ToLower())
                {
                    case "system.int16":
                        {
                            return NullShort;
                            break;
                        }

                    case "system.int32":
                        {
                            return NullInteger;
                            break;
                        }

                    case "system.int64":
                        {
                            return NullLong;
                            break;
                        }

                    case "system.single":
                        {
                            return NullSingle;
                            break;
                        }

                    case "system.double":
                        {
                            return NullDouble;
                            break;
                        }

                    case "system.decimal":
                        {
                            return NullDecimal;
                            break;
                        }

                    case "system.datetime":
                        {
                            return NullDate;
                            break;
                        }

                    case "system.string":
                    case "system.char":
                        {
                            return NullString;
                            break;
                        }

                    case "system.boolean":
                        {
                            return NullBoolean;
                            break;
                        }

                    case "system.guid":
                        {
                            return NullGuid;
                            break;
                        }

                    default:
                        {
                            // Enumerations default to the first entry
                            Type pType = typeof(T);
                            if (pType.BaseType.Equals(typeof(System.Enum)))
                            {
                                System.Array objEnumValues = System.Enum.GetValues(pType);
                                Array.Sort(objEnumValues);
                                return System.Enum.ToObject(pType, objEnumValues.GetValue(0));
                            }
                            else
                                return null;
                            break;
                        }
                }
            }
        }

        public static T DB_GetValue<T>(object objField)
        {
            if (((objField == DBNull.Value)
                        || ((objField == null)
                        || Null.IsNull(objField))))
            {
                T nullofT = (T)Null.GetNull<T>();
                return nullofT;
            }
            else
            {
                return (T)objField;
            }
        }

        public static T DB_GetValue<T>(object objField, T objDefault)
        {
            if (((objField == DBNull.Value)
                        || ((objField == null)
                        || Null.IsNull(objField))))
            {
                return objDefault;
            }
            else
            {
                return (T)objField;
            }
        }

        public static object GetDBNull(object objectValue)
        {


            if (IsNull(objectValue))
            {
                //voi linq thi return null
                return DBNull.Value;
            }
            else
            {
                return (object)objectValue;
            }
        }
        #endregion
    }
}
