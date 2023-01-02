import {ElementVisibility} from '../../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsDropdownEvents} from './numberOfRowsDropdownEvents';
import {ElementOffset} from '../../../../utils/elements/elementOffset';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {Dropdown} from '../../../dropdown/dropdown';
import {PX} from '../../../../types/dimensions';
import {SIDE} from '../../../../types/side';

export class NumberOfRowsDropdown {
  private static DROPDOWN_WIDTH = 45;

  public static hide(dropdownElement: HTMLElement) {
    Dropdown.hide(dropdownElement);
  }

  private static getDropdownTopPosition(buttonElement: HTMLElement): PX {
    return `${ElementOffset.processTop(buttonElement.offsetTop)}px`;
  }

  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement) {
    const leftOffset = ElementOffset.processLeft(buttonElement.offsetLeft + buttonElement.offsetWidth / 2);
    return `${leftOffset - NumberOfRowsDropdown.DROPDOWN_WIDTH / 2}px`;
  }

  private static displayAndSetDropdownPosition(buttonElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.left = NumberOfRowsDropdown.getLeftPropertyToCenterDropdown(buttonElement);
    dropdownElement.style.top = NumberOfRowsDropdown.getDropdownTopPosition(buttonElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.LEFT)) {
        dropdownElement.style.left = '0px';
      } else if (visibilityDetails.blockingSides.has(SIDE.RIGHT)) {
        dropdownElement.style.left = `${buttonElement.offsetLeft + buttonElement.offsetWidth - Dropdown.DROPDOWN_WIDTH}px`;
      }
    }
  }

  public static display(buttonElement: HTMLElement, dropdownElement: HTMLElement) {
    NumberOfRowsDropdown.displayAndSetDropdownPosition(buttonElement, dropdownElement);
  }

  public static create(etc: EditableTableComponent, optionsButton: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.width = `${NumberOfRowsDropdown.DROPDOWN_WIDTH}px`;
    NumberOfRowsDropdownItem.populate(etc, dropdownElement, optionsButton);
    NumberOfRowsDropdownEvents.set(etc, dropdownElement);
    return dropdownElement;
  }
}