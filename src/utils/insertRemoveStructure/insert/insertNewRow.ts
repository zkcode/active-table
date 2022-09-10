import {EditableTableComponent} from '../../../editable-table-component';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ElementDetails} from '../../../types/elementDetails';
import {RowElement} from '../../../elements/row/rowElement';
import {UpdateRows} from '../shared/updateRows';
import {InsertNewCell} from './insertNewCell';

export class InsertNewRow {
  private static fireCellUpdates(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastDataRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const lastRowDetails: ElementDetails = {element: lastDataRowElement, index: lastRowIndex};
    UpdateRows.update(etc, rowIndex, CELL_UPDATE_TYPE.ADD, lastRowDetails);
    etc.onTableUpdate(etc.contents);
  }

  // prettier-ignore
  private static addCells(etc: EditableTableComponent,
      newRowData: TableRow, newRowElement: HTMLElement, rowIndex: number, isNewText: boolean) {
    newRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      InsertNewCell.insertToRow(etc, newRowElement, rowIndex, columnIndex, cellText as string, isNewText);
    });
  }

  private static createNewRowData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultCellValue);
  }

  private static insertNewRow(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    const newRowData = rowData || InsertNewRow.createNewRowData(etc);
    const newRowElement = RowElement.create();
    etc.tableBodyElementRef?.insertBefore(newRowElement, etc.tableBodyElementRef.children[rowIndex]);
    // don't need a timeout as addition of row with new text is not expensive
    if (isNewText) etc.contents.splice(rowIndex, 0, []);
    InsertNewRow.addCells(etc, newRowData, newRowElement, rowIndex, isNewText);
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  public static insert(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    InsertNewRow.insertNewRow(etc, rowIndex, isNewText, rowData);
    if (isNewText) {
      setTimeout(() => InsertNewRow.fireCellUpdates(etc, rowIndex));
    }
  }

  public static insertEvent(this: EditableTableComponent, rowIndex: number) {
    InsertNewRow.insert(this, rowIndex, true);
  }
}