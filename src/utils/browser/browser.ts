export class Browser {
  public static readonly IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  public static readonly IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // can't use DateCellInputElement class as this is called before CellElement class can be used
  private static createDateInput() {
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    return dateInput;
  }

  public static readonly IS_INPUT_DATE_SUPPORTED =
    Browser.createDateInput().type === 'date' && 'showPicker' in HTMLInputElement.prototype;
}
