import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElements} from './columnSizerElements';
import {TableRow} from '../../types/tableContents';
import {CellEvents} from './cellEvents';

export class CellElement {
  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, newRowIndex: number, columnIndex: number) {
    cellElement.oninput = CellEvents.inputCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onpaste = CellEvents.pasteCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onblur = CellEvents.blurCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onfocus = CellEvents.focusCell.bind(etc, newRowIndex, columnIndex);
    if (newRowIndex === 0) {
      cellElement.onmouseenter = CellEvents.mouseEnterCell.bind(etc, columnIndex);
      cellElement.onmouseleave = CellEvents.mouseLeaveCell.bind(etc, columnIndex);
    }
  }

  private static createCellDOMElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const isContentEditable = isHeader ? !!etc.areHeadersEditable : true;
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.contentEditable = String(isContentEditable);
    cellElement.textContent = cellText as string;
    return cellElement;
  }

  // prettier-ignore
  public static createCellElement(etc: EditableTableComponent,
      cellText: string, rowIndex: number, columnIndex: number, isHeader: boolean) {
    const cellElement = CellElement.createCellDOMElement(etc, cellText, isHeader);
    CellElement.setCellEvents(etc, cellElement, rowIndex, columnIndex);
    if (etc.overlayElementsParentRef) {
      ColumnSizerElements.createNew(etc.overlayElementsParentRef, etc.overlayElements.columnSizers);
    }
    return cellElement;
  }

  // prettier-ignore
  public static createRowCellElements(etc: EditableTableComponent,
      dataRow: TableRow, rowIndex: number, isHeader: boolean) {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      return CellElement.createCellElement(etc, cellText as string, rowIndex, columnIndex, isHeader);
    });
  }
}
