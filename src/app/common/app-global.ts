export class AppGlobals {
  public static readonly LANGUAGE = 'language';

  /**
   * Sets language
   * @param lang : ngôn ngữ muốn setting: vi/en
   */
  public static setLang(lang: string) {
    localStorage.setItem(this.LANGUAGE, lang);
  }

  /**
   * TODO: lấy từ app-settting
   * Gets language
   * @returns lang Ngôn ngữ đã được lưu trước đó
   * mặc định nếu chưa null thì set lại vi
   */
  public static getLang(): string {
    if (!localStorage.getItem(this.LANGUAGE)) {
      localStorage.setItem(this.LANGUAGE, 'vi');
    }
    return localStorage.getItem(this.LANGUAGE) || '';
  }
}
