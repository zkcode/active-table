import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElements} from '../cell/columnSizerElements';
import {ColumnSizerEvents} from '../cell/columnSizerEvents';

export class TableEvents {
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains(ColumnSizerElements.COLUMN_WIDTH_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = event.target as HTMLElement;
    }
  }

  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    if (this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseUp(this.tableElementEventState.selectedColumnSizer, event.target as HTMLElement);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }

  // prettier-ignore
  public static onMouseMove(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, overlayElements: { columnSizers }, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseMove(selectedColumnSizer, columnSizers, columnsDetails, event.movementX);
    }
  }

  public static onMouseLeave(this: EditableTableComponent) {
    if (this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseLeave(this.tableElementEventState.selectedColumnSizer);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }
}
