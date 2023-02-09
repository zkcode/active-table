import {CustomColumnsSettings, CustomColumnSettings, DimensionalCSSStyle} from './types/columnsSettings';
import {ActiveOverlayElementsUtils} from './utils/activeOverlayElements/activeOverlayElementsUtils';
import {ColumnUpdateDetails, OnCellUpdate, OnColumnsUpdate, OnTableUpdate} from './types/onUpdate';
import {FrameComponentsInternalUtils} from './utils/frameComponents/frameComponentsInternalUtils';
import {RowDropdownSettingsUtil} from './elements/dropdown/rowDropdown/rowDropdownSettingsUtil';
import {UserKeyEventsStateUtils} from './utils/userEventsState/userEventsStateUtils';
import {PaginationInternalUtils} from './utils/pagination/paginationInternalUtils';
import {InitialContentProcessing} from './utils/content/initialContentProcessing';
import {FocusedElementsUtils} from './utils/focusedElements/focusedElementsUtils';
import {TableDimensionsUtils} from './utils/tableDimensions/tableDimensionsUtils';
import {ColumnSettingsUtils} from './utils/columnSettings/columnSettingsUtils';
import {ColumnDropdownSettingsDefault} from './types/columnDropdownSettings';
import {PaginationElements} from './elements/pagination/paginationElements';
import {ColumnDetailsUtils} from './utils/columnDetails/columnDetailsUtils';
import {DynamicCellUpdate} from './utils/dynamicUpdates/dynamicCellUpdate';
import {FrameComponentsStyle, IndexColumnT} from './types/frameComponents';
import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {DefaultColumnTypes} from './utils/columnType/defaultColumnTypes';
import {FrameComponentsInternal} from './types/frameComponentsInternal';
import {RowDropdownCellOverlays} from './types/rowDropdownCellOverlays';
import {ColumnsSettingsDefault} from './types/columnsSettingsDefault';
import {StickyPropsUtils} from './utils/stickyProps/stickyPropsUtils';
import {ActiveOverlayElements} from './types/activeOverlayElements';
import {CellHighlightUtils} from './utils/color/cellHighlightUtils';
import {ColumnsSettingsMap} from './types/columnsSettingsInternal';
import {customElement, property, state} from 'lit/decorators.js';
import {RowDropdownSettings} from './types/rowDropdownSettings';
import {StripedRowsInternal} from './types/stripedRowsInternal';
import {DEFAULT_COLUMN_TYPES} from './enums/defaultColumnTypes';
import {DefaultCellHoverColors} from './types/cellStateColors';
import {WindowElement} from './elements/window/windowElement';
import {UserKeyEventsState} from './types/userKeyEventsState';
import {PaginationInternal} from './types/paginationInternal';
import {LabelColorUtils} from './utils/color/labelColorUtils';
import {DynamicCellUpdateT} from './types/dynamicCellUpdateT';
import {OverflowUtils} from './utils/overflow/overflowUtils';
import {CellText, TableContent} from './types/tableContent';
import {RowHoverEvents} from './utils/rows/rowHoverEvents';
import {TableElement} from './elements/table/tableElement';
import {ColumnType, ColumnTypes} from './types/columnType';
import {OverflowInternal} from './types/overflowInternal';
import {ParentResize} from './utils/render/parentResize';
import {ColumnResizerColors} from './types/columnSizer';
import {TableDimensions} from './types/tableDimensions';
import {FocusedElements} from './types/focusedElements';
import {HoveredElements} from './types/hoveredElements';
import {HeaderIconStyle} from './types/headerIconStyle';
import {HoverableStyles} from './types/hoverableStyles';
import {ColumnsDetailsT} from './types/columnDetails';
import {GlobalItemColors} from './types/itemToColor';
import {StripedRows} from './utils/rows/stripedRows';
import {activeTableStyle} from './activeTableStyle';
import {RowHoverStyle} from './types/rowHoverStyle';
import {StripedRowsT} from './types/stripedRows';
import {StickyProps} from './types/stickyProps';
import {Browser} from './utils/browser/browser';
import {LitElement, PropertyValues} from 'lit';
import {TableStyle} from './types/tableStyle';
import {Pagination} from './types/pagination';
import {Render} from './utils/render/render';
import {EMPTY_STRING} from './consts/text';
import {Overflow} from './types/overflow';

// WORK - edit the generated type file and remove private properties, otherwise use one object for internal state
// WORK - perhaps rename Internal types to use _
// WORK - make sure border is calculated when setting width to be 100%
@customElement('active-table')
export class ActiveTable extends LitElement {
  static override styles = [activeTableStyle];

  public static ELEMENT_TAG = 'ACTIVE-TABLE';

  @property({type: Function})
  getContent: () => TableContent = () => JSON.parse(JSON.stringify(this.content));

  @property({type: Function})
  getColumnsDetails: () => ColumnUpdateDetails[] = () => ColumnDetailsUtils.getAllColumnsDetails(this.columnsDetails);

  @property({type: Function})
  updateCell: (update: DynamicCellUpdateT) => void = (update: DynamicCellUpdateT) => {
    DynamicCellUpdate.updateText(this, update);
  };

  // WORK - generate/parse csv

  // REF-20
  @property({converter: LITElementTypeConverters.convertToFunction})
  onCellUpdate: OnCellUpdate = () => {};

  @property({converter: LITElementTypeConverters.convertToFunction})
  onContentUpdate: OnTableUpdate = () => {};

  @property({converter: LITElementTypeConverters.convertToFunction})
  onColumnsUpdate: OnColumnsUpdate = () => {};

  @property({type: Array})
  content: TableContent = [
    // ['Planet', 'Diameter', 'Mass', 'Moons', 'Density'],
    // ['Earth', 12756, 5.97, 1, 5514],
    // ['Mars', 6792, 0.642, 2, 3934],
    // ['Jupiter', 142984, 1898, 79, 1326],
    // ['Saturn', 120536, 568, 82, 687],
    // ['Neptune', 49528, 102, 14, 1638],
  ];

  @property({type: Object})
  tableStyle: TableStyle = {};

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  allowDuplicateHeaders = true;

  // WORK - perhaps this should be in colum settings
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayHeaderIcons = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  spellCheck = false;

  // Bug - header row events do not work in Firefox when there are 21 rows or more
  // A question has been raised in the following link:
  // https://stackoverflow.com/questions/75103886/firefox-table-sticky-header-row-events-not-firing
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  stickyHeader?: boolean;

  // setting header to true if above is undefined and vertical overflow is present
  // (using object to be able to set values without re-rendering the component)
  @state()
  stickyProps: StickyProps = {header: false};

  // REF-21
  @state()
  columnsSettings: ColumnsSettingsDefault = {};

  @property({type: Array<CustomColumnSettings>})
  customColumnsSettings: CustomColumnsSettings = [];

  @state()
  customColumnsSettingsInternal: ColumnsSettingsMap = {};

  // this contains all cell elements, if there is a need to access cell elements outside the context of columns
  // create an entirely new state object and access elements from there as we don't want to store all elements
  // multiple times, and use this instead for data exclusively on columns, such as width at.
  @state()
  columnsDetails: ColumnsDetailsT = [];

  @state()
  tableElementRef: HTMLElement | null = null;

  @state()
  tableBodyElementRef: HTMLElement | null = null;

  @state()
  addRowCellElementRef: HTMLElement | null = null;

  // the reason why keeping ref of all the add column cells and not column index cells is because this can be toggled
  @state()
  addColumnCellsElementsRef: HTMLElement[] = [];

  @state()
  columnGroupRef: HTMLElement | null = null;

  @state()
  focusedElements: FocusedElements = FocusedElementsUtils.createEmpty();

  @state()
  hoveredElements: HoveredElements = {};

  @state()
  activeOverlayElements: ActiveOverlayElements = ActiveOverlayElementsUtils.createNew();

  @state()
  userKeyEventsState: UserKeyEventsState = UserKeyEventsStateUtils.createNew();

  @state()
  tableDimensions: TableDimensions = TableDimensionsUtils.getDefault();

  @state()
  cellDropdownContainer: HTMLElement | null = null;

  @state()
  globalItemColors: GlobalItemColors = LabelColorUtils.generateGlobalItemColors();

  @property({type: Object})
  rowHoverStyle: RowHoverStyle | null = null;

  // when true - the table automatically holds an unlimited size via table-controlled-width class (dynamic table)
  // this property is not used internally and is being set/used in tableDimensions as it is overriden when resizing
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  preserveNarrowColumns = true;

  @state()
  defaultCellHoverColors: DefaultCellHoverColors = CellHighlightUtils.getDefaultHoverProperties();

  @property({type: Number})
  maxColumns?: number;

  @property({type: Number})
  maxRows?: number;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddNewRow = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  displayAddNewColumn = true;

  @property({type: Object})
  displayIndexColumn: boolean | IndexColumnT = {wrapIndexCellText: true};

  // REF-22 - to be used internally
  @state()
  frameComponentsInternal: FrameComponentsInternal = FrameComponentsInternalUtils.getDefault();

  // REF-22 - to be used by the client
  // frame components are comprised of index column, add new column column and add new row row
  @property({type: Object})
  frameComponentsStyle: FrameComponentsStyle = {};

  // this affects the column index and pagination
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  dataStartsAtHeader = false;

  // called columnResizer for the client - columnSizer in the code
  @property({type: Object})
  columnResizerColors: ColumnResizerColors = {};

  @property({type: Object})
  rowDropdown: RowDropdownSettings = {displaySettings: {isAvailable: true, openMethod: {cellClick: true}}};

  // column dropdown overlays are stored inside ColumnDetailsT columnDropdownCellOverlay
  @state()
  rowDropdownCellOverlays: RowDropdownCellOverlays = [];

  // if using pagination with user defined rowsPerPageSelect, the options need to have an even number or otherwise
  // two rows could have same color (as rows are hidden and not removed)
  @property({type: Object})
  stripedRows: StripedRowsT | boolean | null = null;

  @state()
  stripedRowsInternal: StripedRowsInternal | null = null;

  // WORK - remove nulls and replace with undefined?
  @property({type: Object})
  overflow: Overflow | null = null;

  @property({type: String})
  defaultText?: CellText = EMPTY_STRING;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isDefaultTextRemovable?: boolean = true;

  @property({type: Object})
  cellStyle?: DimensionalCSSStyle;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isCellTextEditable? = true;

  @property({type: Object})
  headerStyles?: HoverableStyles;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isHeaderTextEditable?: boolean; // uses isCellTextEditable by default

  @property({type: Object})
  headerIconStyle?: HeaderIconStyle;

  // if no width is defined this will simply just not show the sizer
  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
  })
  isColumnResizable?: boolean = true;

  @property({type: Array<DEFAULT_COLUMN_TYPES>})
  availableDefaultColumnTypes?: DEFAULT_COLUMN_TYPES[]; // this will reduce the default types to ones included here

  @property({type: Array<ColumnType>})
  customColumnTypes?: ColumnTypes; // additional custom column types

  // WORK - rename to defaultColumnTypeName
  // If not provided defaultActiveTypeName will default to first of the following:
  // First type to not have validation/First available type/'Text'
  @property({type: String})
  defaultActiveTypeName?: string;

  @property({type: Object})
  columnDropdown?: ColumnDropdownSettingsDefault;

  @state()
  overflowInternal: OverflowInternal | null = null;

  @property({type: Object})
  pagination: Pagination | boolean | null = null;

  @state()
  paginationInternal: PaginationInternal = PaginationInternalUtils.getDefault();

  @state({
    hasChanged() {
      return false;
    },
  })
  isRendering = false;

  // CAUTION-4
  override render() {
    Render.renderTable(this);
    this.onContentUpdate(this.content);
    new ResizeObserver(ParentResize.resizeCallback.bind(this)).observe(this.parentElement as HTMLElement);
  }

  override update(changedProperties: PropertyValues) {
    StickyPropsUtils.process(this);
    ColumnSettingsUtils.setUpInternalSettings(this);
    FrameComponentsInternalUtils.set(this);
    DefaultColumnTypes.createDropdownItemsForDefaultTypes();
    RowDropdownSettingsUtil.process(this);
    if (this.pagination) PaginationInternalUtils.process(this);
    if (this.stripedRows) StripedRows.process(this);
    if (this.rowHoverStyle) RowHoverEvents.process(this.rowHoverStyle, this.defaultCellHoverColors);
    const tableElement = TableElement.createInfrastructureElements(this);
    if (this.overflow) OverflowUtils.setupContainer(this, tableElement); // must not be after BORDER_DIMENSIONS is set
    TableElement.addOverlayElements(this, tableElement, this.activeOverlayElements);
    this.shadowRoot?.appendChild(this.overflowInternal?.overflowContainer || tableElement);
    if (this.pagination) PaginationElements.create(this);
    InitialContentProcessing.preProcess(this);
    WindowElement.setEvents(this);
    this.spellcheck = this.spellCheck;
    super.update(changedProperties);
  }

  override connectedCallback() {
    // REF-14
    if (Browser.IS_FIREFOX) {
      setTimeout(() => super.connectedCallback()); // WORK - see if the firefox issue can be fixed
    } else {
      super.connectedCallback();
    }
  }
}

// if using raw javascript, this is a direction to help move away from using render
// the initial values should be fetched in connectedCallBack (or set to default) and their changes can be observed in
// MutationObserver, this would also save callback and boolean changes from having to re-render the screen

// @state()
// observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.attributeName === 'content') {
//       console.log(mutation);
//       console.log('attributes changed');
//     }
//   });
// });

// override connectedCallback() {
//   super.connectedCallback();
//   this.observer.observe(this, {
//     attributes: true, //configure it to listen to attribute changes
//   });
