import {TableContents} from '../../types/tableContents';

export class ExtractElements {
  public static textCellsArrFromRow(rowElement: HTMLElement) {
    return Array.from(rowElement.children).filter((child) => child.tagName === 'TH' || child.tagName === 'TD');
  }

  public static textRowsArrFromTBody(tableBodyElement: HTMLElement, contents: TableContents) {
    // not returning aux rows that contain other utils such as add new row
    return Array.from(tableBodyElement.children).slice(0, contents.length);
  }
}