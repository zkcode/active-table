import {ColumnDropdownCellOverlay} from '../../elements/dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {HeaderIconCellElement} from '../../elements/cell/cellsWithTextDiv/headerIconCell/headerIconCellElement';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsInternal, ColumnsSettingsMap} from '../../types/columnsSettingsInternal';
import {CustomColumnsSettings, CustomColumnSettings} from '../../types/columnsSettings';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {StringDimensionUtils} from '../tableDimensions/stringDimensionUtils';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {ResetColumnStructure} from './resetColumnStructure';
import {CellElement} from '../../elements/cell/cellElement';
import {GenericObject} from '../../types/genericObject';
import {EMPTY_STRING} from '../../consts/text';
import {CSSStyle} from '../../types/cssStyle';

export class ColumnSettingsUtils {
  private static updateSizer(etc: EditableTableComponent, columnIndex: number) {
    const {columnsDetails, tableElementRef} = etc;
    if (!tableElementRef) return;
    const {columnSizer} = columnsDetails[columnIndex];
    // if not needed - cleanUpCustomColumnSizers will remove it (however it would not insert it otherwise)
    if (!columnSizer) InsertRemoveColumnSizer.insert(etc, columnIndex);
    InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
    if (columnSizer) {
      InsertRemoveColumnSizer.updateSizer(columnSizer, columnsDetails, columnIndex, tableElementRef);
    }
    const previousColumnIndex = columnIndex - 1;
    if (columnIndex > 0 && columnsDetails[previousColumnIndex].columnSizer) {
      const {columnSizer: previousColumnSizer} = columnsDetails[previousColumnIndex];
      InsertRemoveColumnSizer.updateSizer(previousColumnSizer, columnsDetails, previousColumnIndex, tableElementRef);
    }
  }

  // prettier-ignore
  private static change(etc: EditableTableComponent, headerElement: HTMLElement, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal) {
    const columnDetails = etc.columnsDetails[columnIndex];
    ColumnSettingsDefaultTextUtils.unsetDefaultText(etc, columnDetails, columnIndex);
    columnDetails.settings = newSettings;
    Object.assign(columnDetails, ColumnTypesUtils.getProcessedTypes(newSettings, columnDetails.activeType.name));
    ResetColumnStructure.reset(etc, columnDetails, columnIndex);
    ColumnSettingsDefaultTextUtils.setDefaultText(etc, columnDetails, columnIndex);
    ColumnSettingsWidthUtils.changeWidth(etc, headerElement, oldSettings, newSettings);
    ColumnSettingsStyleUtils.changeStyle(etc, columnIndex, oldSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
    ColumnSettingsUtils.updateSizer(etc, columnIndex);
    if (etc.areIconsDisplayedInHeaders) HeaderIconCellElement.changeHeaderIcon(etc.columnsDetails[columnIndex]);
    ColumnDropdownCellOverlay.updateIfDisplayed(columnDetails);
    AddNewColumnElement.toggle(etc, true);
  }

  // prettier-ignore
  public static parseSettingsChange(etc: EditableTableComponent) {
    const {customColumnsSettingsInternal, columnsDetails,
      focusedElements: {cell: {element: cellElement, columnIndex}}} = etc;
    const columnDetails = columnsDetails[columnIndex as number];
    const oldSettings = columnDetails.settings;
    const newSettings = customColumnsSettingsInternal[CellElement.getText(cellElement as HTMLElement)]
      || etc.defaultColumnsSettings;
    return { oldSettings, newSettings, areSettingsDifferent: oldSettings !== newSettings }; 
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {oldSettings, newSettings, areSettingsDifferent} = ColumnSettingsUtils.parseSettingsChange(etc);
    if (areSettingsDifferent) ColumnSettingsUtils.change(etc, cellElement, columnIndex, oldSettings, newSettings);
  }

  // prettier-ignore
  private static setDimension(settings: CustomColumnSettings, defSettings: ColumnsSettingsDefault, 
      dimension: 'width'|'minWidth') {
    const internalSettings = settings as ColumnSettingsInternal;
    if (settings.cellStyle?.[dimension]) {
      internalSettings[dimension] = settings.cellStyle[dimension]
    } else if (defSettings.cellStyle?.[dimension]) {
      internalSettings[dimension] = defSettings.cellStyle[dimension]      
    }
  }

  // prettier-ignore
  private static processCellDimensions(settings: CustomColumnSettings, defSettings: ColumnsSettingsDefault) {
    const internalSettings = settings as ColumnSettingsInternal;
    if (!settings.cellStyle) return;
    ColumnSettingsUtils.setDimension(settings, defSettings, 'minWidth');
    ColumnSettingsUtils.setDimension(settings, defSettings, 'width');
    StringDimensionUtils.removeAllDimensions(internalSettings.cellStyle as CSSStyle)
    StringDimensionUtils.removeAllDimensions(defSettings.cellStyle as CSSStyle)
  }

  private static createInternalSettings(settings: CustomColumnSettings, defSettings: ColumnsSettingsDefault) {
    const internalSettings = settings as ColumnSettingsInternal;
    if (ColumnSettingsStyleUtils.doesSettingHaveSideBorderStyle(internalSettings)) {
      internalSettings.stylePrecedence = true; // REF-23
    }
    ColumnSettingsUtils.processCellDimensions(settings, defSettings);
    Object.keys(defSettings).forEach((key: string) => {
      (internalSettings as unknown as GenericObject)[key] ??= defSettings[key as keyof ColumnsSettingsDefault] as string;
    });
    return internalSettings;
  }

  private static createInternalMap(clientSettings: CustomColumnsSettings, defaultSettings: ColumnsSettingsDefault) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.columnName] = ColumnSettingsUtils.createInternalSettings(clientSettings, defaultSettings);
      return settingsMap;
    }, {});
  }

  private static processDefaultColumnsSettings(defaultColumnsSettings: ColumnsSettingsDefault) {
    defaultColumnsSettings.defaultText ??= EMPTY_STRING;
    defaultColumnsSettings.isDefaultTextRemovable ??= true;
    defaultColumnsSettings.isCellTextEditable ??= true;
    defaultColumnsSettings.isHeaderTextEditable ??= defaultColumnsSettings.isCellTextEditable;
    defaultColumnsSettings.isSortAvailable ??= true;
    defaultColumnsSettings.isDeleteAvailable ??= true;
    defaultColumnsSettings.isInsertLeftAvailable ??= true;
    defaultColumnsSettings.isInsertRightAvailable ??= true;
    defaultColumnsSettings.isMoveAvailable ??= false;
  }

  // prettier-ignore
  public static setUpInternalSettings(etc: EditableTableComponent) {
    ColumnSettingsUtils.processDefaultColumnsSettings(etc.defaultColumnsSettings);
    etc.customColumnsSettingsInternal = ColumnSettingsUtils.createInternalMap(
      etc.customColumnsSettings, etc.defaultColumnsSettings);
  }
}
