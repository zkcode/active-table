import {ColumnsDetailsT, ColumnDetailsT, ColumnDetailsNoSizer} from '../../../types/columnDetails';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSizerOverlayElement} from '../columnSizerOverlayElement';
import {MovableColumnSizerElement} from '../movableColumnSizerElement';
import {ColumnSizerFillerElement} from '../columnSizerFillerElement';
import {ColumnSizerElement} from '../columnSizerElement';
import {ColumnSizerT} from '../../../types/columnSizer';
import {ColumnSizer} from './columnSizer';

export class InsertRemoveColumnSizer {
  private static updateIdsOfAllSubsequent(columnsDetails: ColumnsDetailsT, nextIndex: number) {
    columnsDetails.slice(nextIndex).forEach((columnDetails: ColumnDetailsT, index: number) => {
      if (!columnDetails.columnSizer) return;
      const relativeIndex = nextIndex + index;
      ColumnSizerElement.setElementId(columnDetails.columnSizer.element, relativeIndex);
    });
  }

  private static applySizerStateToElements(columnSizer: ColumnSizerT) {
    const {element: sizerElement, movableElement, overlayElement, styles} = columnSizer;
    ColumnSizerElement.unsetElementsToDefault(sizerElement, styles.default.width);
    ColumnSizerFillerElement.setWidth(sizerElement.children[0] as HTMLElement, styles.default.width);
    ColumnSizerElement.setStaticProperties(sizerElement, styles.static.marginRight);
    ColumnSizerElement.setBackgroundImage(sizerElement, styles.default.backgroundImage);
    MovableColumnSizerElement.setStaticProperties(movableElement, styles.static.marginRight, styles.hover.width);
    ColumnSizerOverlayElement.setStaticProperties(overlayElement, styles.static.marginRight, styles.hover.width);
  }

  private static insertAtIndex(etc: EditableTableComponent, newColumnDetails: ColumnDetailsNoSizer, columnIndex: number) {
    // assuming this has already been added, otherwise pass it down through params
    const cellDividerElement = newColumnDetails.elements[0].nextSibling as HTMLElement;
    const columnSizer = ColumnSizer.create(etc, columnIndex);
    newColumnDetails.columnSizer = columnSizer;
    cellDividerElement.appendChild(columnSizer.element);
    cellDividerElement.appendChild(columnSizer.overlayElement);
    cellDividerElement.appendChild(columnSizer.movableElement);
    InsertRemoveColumnSizer.applySizerStateToElements(columnSizer);
  }

  private static updatePrevious(columnsDetails: ColumnsDetailsT, columnIndex: number, tableElement: HTMLElement) {
    const previousIndex = columnIndex - 1;
    if (previousIndex < 0) return;
    const {columnSizer} = columnsDetails[previousIndex];
    if (columnsDetails[previousIndex].settings?.width !== undefined) return;
    // no need for full creation as there is a need to retain the element and its bindings
    const newColumnSizer = ColumnSizer.createObject(columnSizer.element, columnsDetails, previousIndex, tableElement);
    // cannot simply overwright columnSizer object as it has already binded to elements
    // movableElement ref is not overwritten
    Object.assign(columnSizer, newColumnSizer);
    InsertRemoveColumnSizer.applySizerStateToElements(columnSizer);
  }

  private static getNewColumnIndexIfWidthSet(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    // if inserting at the end and the previous column has a sizer (happens when populating the table initially)
    // do not insert a new sizer, if no sizer - insert a new sizer
    if (columnsDetails.length - 1 === columnIndex) {
      return columnsDetails[columnIndex - 1]?.columnSizer ? -1 : columnIndex - 1;
    }
    return columnIndex;
  }

  // REF-13
  public static insert(etc: EditableTableComponent, columnsDetails: ColumnsDetailsT, columnIndex: number) {
    if (columnsDetails[columnIndex].settings?.width !== undefined) return;
    if (etc.tableDimensionsInternal.width !== undefined) {
      columnIndex = InsertRemoveColumnSizer.getNewColumnIndexIfWidthSet(etc.columnsDetails, columnIndex);
      if (columnIndex === -1 || columnsDetails[columnIndex].settings?.width !== undefined) return;
    } else {
      // only dynamic width tables have a sizer on the last column - hence only their styles need to be changed
      InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex, etc.tableElementRef as HTMLElement);
    }
    InsertRemoveColumnSizer.insertAtIndex(etc, etc.columnsDetails[columnIndex], columnIndex);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex + 1);
  }

  // this is only used for when table width is static, otherwise it is removed directly with the column
  private static removeSizer(newColumnDetails: ColumnDetailsNoSizer) {
    const cellDividerElement = newColumnDetails.elements[0].nextSibling as HTMLElement;
    cellDividerElement.replaceChildren();
    delete newColumnDetails.columnSizer;
  }

  // need to remove the sizer of the new last column as when width is set - last column does not have a sizer
  private static removeIfLastColumn(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    const isLastColumn = columnsDetails.length === columnIndex;
    if (isLastColumn && columnsDetails[columnIndex]) {
      columnIndex -= 1;
      InsertRemoveColumnSizer.removeSizer(columnsDetails[columnIndex]);
    }
    return columnIndex;
  }

  public static remove(etc: EditableTableComponent, columnIndex: number) {
    const {tableDimensionsInternal, columnsDetails, tableElementRef} = etc;
    if (tableDimensionsInternal.width !== undefined) {
      columnIndex = InsertRemoveColumnSizer.removeIfLastColumn(columnsDetails, columnIndex);
    }
    InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex, tableElementRef as HTMLElement);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex);
  }
}
