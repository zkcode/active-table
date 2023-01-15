import {ConvertCellTypeUtils} from '../../../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {LabelCellTextElement} from './labelCellTextElement';
import {LabelCellEvents} from './labelCellEvents';
import {CellElement} from '../../../cellElement';
import {SelectCell} from '../selectCell';

export class LabelCellElement {
  // prettier-ignore
  public static setCellLabelStructure(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    const {selectDropdown: {selectItems}, settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    const backgroundColor = selectItems[CellElement.getText(cellElement)]?.color || '';
    LabelCellTextElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    SelectCell.setPointerCursorIfCantAdd(cellElement, etc.columnsDetails[columnIndex].activeType)
  }

  public static setColumnLabelStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, LabelCellElement.setCellLabelStructure, LabelCellEvents.setEvents);
  }
}
