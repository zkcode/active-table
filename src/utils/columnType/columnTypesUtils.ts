import {ColumnTypeInternal, ColumnTypesInternal} from '../../types/columnTypeInternal';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {ColumnType, ColumnTypes, DropdownIconSettings} from '../../types/columnType';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {DefaultColumnTypes} from './defaultColumnTypes';
import {CellText} from '../../types/tableContents';
import {ObjectUtils} from '../object/objectUtils';
import {Validation} from './validation';

export class ColumnTypesUtils {
  public static get(settings: ColumnSettingsInternal): ColumnTypes {
    let columnTypes = [
      ...DefaultColumnTypes.DEFAULT_STATIC_TYPES,
      // the reason why category is not with the default static types is because its validation gets set depending
      // on column default settings
      {
        name: DEFAULT_COLUMN_TYPES.CATEGORY,
        categories: {},
        dropdownItem: DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM,
      },
    ];
    const {defaultColumnTypes, customColumnTypes} = settings;
    if (defaultColumnTypes) {
      const lowerCaseDefaultNames = defaultColumnTypes.map((typeName) => typeName.toLocaleLowerCase());
      columnTypes = columnTypes.filter((type) => {
        return lowerCaseDefaultNames.indexOf(type.name.toLocaleLowerCase() as DEFAULT_COLUMN_TYPES) > -1;
      });
    }
    if (customColumnTypes) columnTypes.push(...customColumnTypes);
    if (columnTypes.length === 0) columnTypes.push(DefaultColumnTypes.DEFAULT_TYPE);
    return columnTypes;
  }

  // prettier-ignore
  private static getActiveType(settings: ColumnSettingsInternal, availableTypes: ColumnTypesInternal) {
    if (settings.activeTypeName) {
      const activeType = availableTypes.find(
        (type) => type.name.toLocaleLowerCase() === settings.activeTypeName?.toLocaleLowerCase());
      if (activeType) return activeType;
    }
    // if activeTypeName is not provided, default to first of the following:
    // First type to not have validation/First available type/'Text'
    const noValidationType = availableTypes.find((type) => !type.textValidation.func);
    if (noValidationType) return noValidationType;
    const firstType = availableTypes[0];
    if (firstType) return firstType;
    return DefaultColumnTypes.DEFAULT_TYPE;
  }

  private static getReusableDefaultIcon(iconSettings: DropdownIconSettings) {
    const targetIconName = iconSettings.defaultIconName?.toLocaleLowerCase();
    if (targetIconName === DEFAULT_COLUMN_TYPES.CATEGORY.toLocaleLowerCase()) {
      return DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM?.settings.iconSettings as DropdownIconSettings;
    }
    const defaultSettings = DefaultColumnTypes.DEFAULT_STATIC_TYPES.find((type) => {
      return type.name.toLocaleLowerCase() === targetIconName;
    });
    if (defaultSettings?.dropdownIconSettings) return defaultSettings.dropdownIconSettings;
    return iconSettings;
  }

  private static processDropdownItemSettings(type: ColumnType) {
    const {name, dropdownIconSettings} = type;
    let iconSettings = (dropdownIconSettings || {}) as DropdownIconSettings;
    if (iconSettings.defaultIconName) iconSettings = ColumnTypesUtils.getReusableDefaultIcon(iconSettings);
    const {svgString, containerStyle} = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
    iconSettings.svgString ??= svgString;
    iconSettings.containerStyle ??= containerStyle;
    // reason for using timeout - creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      const settings = {text: name, iconSettings};
      (type as ColumnTypeInternal).dropdownItem ??= {
        element: DropdownItem.createButtonWithoutEvents(undefined, settings),
        settings: settings,
      };
    });
  }

  private static processTextValidationProps(type: ColumnType) {
    type.textValidation ??= {};
    type.textValidation.setTextToDefaultOnFail ??= true;
  }

  private static processCategories(type: ColumnType, isDefaultTextRemovable: boolean, defaultText: CellText) {
    if (typeof type.categories === 'boolean') {
      type.categories = {};
    } else if (typeof type.categories === 'object') {
      Validation.setCategoriesValidation(type as ColumnTypeInternal, isDefaultTextRemovable, defaultText);
    }
  }

  // the reason why this is needed is when the argument is JSON stringified, properties that hold functions are removed,
  // hence they can only be applied to the component as strings
  private static convertStringFunctionsToRealFunctions(type: ColumnType) {
    if (type.textValidation) ObjectUtils.convertStringToFunction(type.textValidation, 'func');
    if (type.customTextProcessing) {
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeText');
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeStyle');
    }
    if (type.sorting) {
      ObjectUtils.convertStringToFunction(type.sorting, 'ascending');
      ObjectUtils.convertStringToFunction(type.sorting, 'descending');
    }
  }

  private static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      ColumnTypesUtils.convertStringFunctionsToRealFunctions(type);
      ColumnTypesUtils.processCategories(type, isDefaultTextRemovable, defaultText);
      ColumnTypesUtils.processTextValidationProps(type);
      ColumnTypesUtils.processDropdownItemSettings(type);
    });
    return types as ColumnTypesInternal;
  }

  public static getProcessedTypes(settings: ColumnSettingsInternal): Pick<ColumnDetailsT, 'types' | 'activeType'> {
    const {isDefaultTextRemovable, defaultText} = settings;
    const types = ColumnTypesUtils.get(settings);
    const processedInternalTypes = ColumnTypesUtils.process(types, isDefaultTextRemovable, defaultText);
    return {
      types: processedInternalTypes,
      activeType: ColumnTypesUtils.getActiveType(settings, processedInternalTypes) as ColumnTypeInternal,
    };
  }
}
