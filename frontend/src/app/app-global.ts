/** Class set apiEndpoint, LANGUAGE,
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */

export class AppGlobals {
  static apiEndpoint: string;
  public static readonly LANGUAGE = 'language';
  static selectedId: any;

  /** Sets language
   *  @param lang : ngôn ngữ muốn setting: vi/en
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
