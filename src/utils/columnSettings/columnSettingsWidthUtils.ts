import {StringDimensionUtils, SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {ColumnDetailsT} from '../../types/columnDetails';

// REF-24
export class ColumnSettingsWidthUtils {
  public static isWidthDefined(settings?: ColumnSettingsInternal) {
    return settings?.width !== undefined || settings?.minWidth !== undefined;
  }

  // prettier-ignore
  public static getSettingsWidthNumber(tableElement: HTMLElement, settings: ColumnSettingsInternal): SuccessResult {
    const result = settings.minWidth !== undefined ?
    StringDimensionUtils.generateNumberDimensionFromClientString(
      'minWidth', tableElement, settings, ColumnDetails.MINIMAL_COLUMN_WIDTH):
    StringDimensionUtils.generateNumberDimensionFromClientString(
      'width', tableElement, settings, ColumnDetails.MINIMAL_COLUMN_WIDTH);
    // Should always return a successful result for column as parent width should technically be determinible
    return result as SuccessResult;
  }

  // prettier-ignore
  public static updateColumnWidth(tableElement: HTMLElement,
      cellElement: HTMLElement, settings: ColumnSettingsInternal, isNewSetting: boolean) {
    const {width} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElement, settings);
    cellElement.style.width = `${width}px`;
    TableElement.changeStaticWidthTotal(isNewSetting ? width : -width); 
  }

  // prettier-ignore
  public static changeWidth(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      oldSettings: ColumnSettingsInternal | undefined, newSettings: ColumnSettingsInternal, cellElement: HTMLElement) {
    let hasWidthChanged = false;
    if (oldSettings && ColumnSettingsWidthUtils.isWidthDefined(oldSettings)) {
      ColumnSettingsWidthUtils.updateColumnWidth(etc.tableElementRef as HTMLElement, cellElement, oldSettings, false);
      hasWidthChanged = true;
    }
    if (ColumnSettingsWidthUtils.isWidthDefined(newSettings)) {
      ColumnSettingsWidthUtils.updateColumnWidth(etc.tableElementRef as HTMLElement, cellElement, newSettings, true);
      hasWidthChanged = true;
    }
    columnDetails.settings = newSettings;
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }
}