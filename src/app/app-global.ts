/** Class set apiEndpoint, LANGUAGE, pageSizeOptions
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 * @Modified 25/04/1995 - user - description
 */
export class AppGlobals {
  public static pageSizeOptions = [10, 20, 50, 100];
  static apiEndpoint: string;
  public static readonly LANGUAGE = 'language';
  static selectedId: any;
  static activeMenuId: string;
  /** Sets language
   * @param lang : ngôn ngữ muốn setting: vi/en
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public static setLang(lang: string) {
    localStorage.setItem(this.LANGUAGE, lang);
  }

  /** set mặc định vi nếu null
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public static getLang(): string {
    if (!localStorage.getItem(this.LANGUAGE)) {
      localStorage.setItem(this.LANGUAGE, 'vi');
    }
    return localStorage.getItem(this.LANGUAGE) || '';
  }
}
