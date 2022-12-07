import {CategoriesOptions, CategoriesDropdownStyle, CategoriesDropdownOptionStyle} from './categoriesProperties';
import {ColumnTypeInternal, ColumnTypesInternal} from './columnTypeInternal';
import {ColumnSettingsInternal} from './columnsSettings';
import {AUXILIARY_CELL_TYPE} from '../enums/cellType';
import {CellStateColors} from './cellStateColors';
import {ColumnSizerT} from './columnSizer';
import {Optional} from './utilityTypes';

// difference between column details and settings is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

export interface BordersOverwrittenBySiblings {
  left?: boolean;
  right?: boolean;
}

export type CellTypeTotals = {
  [key in string]: number;
} & {[AUXILIARY_CELL_TYPE.Undefined]: number};

export interface ScrollbarPresence {
  horizontal: boolean;
  vertical: boolean;
}

export interface ActiveCategoryItems {
  matchingWithCellText?: HTMLElement;
  hovered?: HTMLElement;
}

export interface CategoryItemDetails {
  color: string;
  element: HTMLElement;
}

export interface CategoryToItem {
  [cellText: string]: CategoryItemDetails;
}

export interface CategoryDropdownT {
  // dropdown item
  categoryToItem: CategoryToItem;
  // items that exhibit certain behaviours
  activeItems: ActiveCategoryItems;
  // REF-8
  element: HTMLElement;
  scrollbarPresence: ScrollbarPresence;
  customDropdownStyle?: CategoriesDropdownStyle;
  customItemStyle?: CategoriesDropdownOptionStyle;
  staticItems?: CategoriesOptions;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
  types: ColumnTypesInternal;
  activeType: ColumnTypeInternal;
  cellTypeTotals: CellTypeTotals;
  categoryDropdown: CategoryDropdownT;
  settings: ColumnSettingsInternal;
  headerStateColors: CellStateColors;
  bordersOverwrittenBySiblings: BordersOverwrittenBySiblings;
}

// REF-13
export type ColumnDetailsInitial = Pick<
  ColumnDetailsT,
  | 'elements'
  | 'types'
  | 'activeType'
  | 'categoryDropdown'
  | 'settings'
  | 'headerStateColors'
  | 'bordersOverwrittenBySiblings'
>;

// REF-13
export type ColumnDetailsNoSizer = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
