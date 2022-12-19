import {INSERT_LEFT_ICON_SVG_STRING, INSERT_RIGHT_ICON_SVG_STRING} from '../../../consts/icons/insertIconSVGStrings';
import {MOVE_LEFT_ICON_SVG_STRING, MOVE_RIGHT_ICON_SVG_STRING} from '../../../consts/icons/moveIconSVGStrings';
import {SORT_ASC_ICON_SVG_STRING, SORT_DESC_ICON_SVG_STRING} from '../../../consts/icons/sortIconSVGString';
import {TRASH_ICON_SVG_STRING} from '../../../consts/icons/trashIconSVGString';
import {DropdownButtonItemSettings} from '../../../types/dropdownButtonItem';

// TO-DO - potential opportunity to use code sharding and download strings later
export class ColumnDropdownButtonItemConf {
  public static readonly ITEMS: DropdownButtonItemSettings[] = [
    {
      text: 'Sort Ascending',
      iconSettings: {svgString: SORT_ASC_ICON_SVG_STRING, containerStyle: {marginRight: '9px', marginTop: '1px'}},
    },
    {
      text: 'Sort Descending',
      iconSettings: {svgString: SORT_DESC_ICON_SVG_STRING, containerStyle: {marginRight: '9px'}},
    },
    {
      text: 'Insert Left',
      iconSettings: {
        svgString: INSERT_LEFT_ICON_SVG_STRING,
        containerStyle: {marginLeft: '-2px', marginRight: '3px', marginTop: '2px'},
      },
    },
    {
      text: 'Insert Right',
      iconSettings: {
        svgString: INSERT_RIGHT_ICON_SVG_STRING,
        containerStyle: {marginLeft: '-3px', marginRight: '4px', marginTop: '2px'},
      },
    },
    {
      text: 'Move Left',
      iconSettings: {
        svgString: MOVE_LEFT_ICON_SVG_STRING,
        containerStyle: {marginLeft: '1px', marginRight: '7px', marginTop: '1px'},
      },
    },
    {
      text: 'Move Right',
      iconSettings: {
        svgString: MOVE_RIGHT_ICON_SVG_STRING,
        containerStyle: {marginLeft: '1px', marginRight: '7px', marginTop: '-1px'},
      },
    },
    {
      text: 'Delete',
      iconSettings: {
        svgString: TRASH_ICON_SVG_STRING,
        containerStyle: {marginLeft: '-4px', marginRight: '5px'},
      },
    },
  ];
}
