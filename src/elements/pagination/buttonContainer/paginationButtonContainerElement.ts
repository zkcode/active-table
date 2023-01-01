import {PaginationPreviousButtonElement} from './buttons/prevNext/paginationPreviousButtonElement';
import {PaginationFirstButtonElement} from './buttons/firstLast/paginationFirstButtonElement';
import {PaginationNumberButtonElement} from './buttons/number/paginationNumberButtonElement';
import {PaginationLastButtonElement} from './buttons/firstLast/paginationLastButtonElement';
import {PaginationNextButtonElement} from './buttons/prevNext/paginationNextButtonElement';
import {PaginationUtils} from '../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {PaginationButtonElement} from './paginationButtonElement';

export class PaginationButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  public static NUMBER_OF_ACTION_BUTTONS = 0;

  private static addNumberButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const requiredNumberOfButtons = PaginationUtils.getLastPossibleButtonNumber(etc);
    const {maxNumberOfButtons} = etc.paginationInternal;
    for (let i = 0; i < Math.min(requiredNumberOfButtons, maxNumberOfButtons); i += 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static addButton(buttonContainerElement: HTMLElement, buttonElement: HTMLElement) {
    buttonContainerElement.appendChild(buttonElement);
    PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS += 1;
  }

  private static populateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const {displayPrevNext, displayFirstLast} = etc.paginationInternal;
    if (displayFirstLast) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationFirstButtonElement.create(etc));
    }
    if (displayPrevNext) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationPreviousButtonElement.create(etc));
    }
    PaginationButtonContainerElement.addNumberButtons(etc, buttonContainerElement);
    if (displayPrevNext) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationNextButtonElement.create(etc));
    }
    if (displayFirstLast) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationLastButtonElement.create(etc));
    }
    if (etc.contents.length < 2) {
      PaginationButtonElement.setDisabled(buttonContainerElement, etc.paginationInternal.style);
    } else {
      PaginationButtonElement.setActive(etc, buttonContainerElement, 1);
    }
  }

  // prettier-ignore
  private static insertToDOM(etc: EditableTableComponent) {
    const containerPosition = etc.paginationInternal.positions.container;
    if (!etc.tableElementRef) return;
    // insert before if on top of table or after if it is below the table
    const insertPosition = containerPosition === 'top-left' || containerPosition === 'top-middle'
      || containerPosition === 'top-right' ? 'beforebegin' : 'afterend'
    etc.tableElementRef.insertAdjacentElement(insertPosition, etc.paginationInternal.buttonContainer as HTMLElement);
  }

  public static create(etc: EditableTableComponent) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PaginationButtonContainerElement.PAGINATION_BUTTON_CONTAINER_ID;
    Object.assign(buttonContainerElement.style, etc.paginationInternal.style.container);
    PaginationButtonContainerElement.populateButtons(etc, buttonContainerElement);
    setTimeout(() => PaginationButtonContainerElement.insertToDOM(etc));
    return buttonContainerElement;
  }
}