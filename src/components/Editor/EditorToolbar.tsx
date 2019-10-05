import React from 'react';
import {
  Button,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
  Select,
  SelectOption
} from '@patternfly/react-core';
import { ListUlIcon, SortAlphaDownIcon, TableIcon } from '@patternfly/react-icons';
import { FilteredRowsContext } from './EditorContainer';

const EditorToolbar: React.FC<{ rows: any[] }> = ({ rows: originalRows }) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [itemToColumnIndexMap, setItemToColumnIndexMap] = React.useState<any>({});
  const [searchValue, setSearchValue] = React.useState('');

  const { rows, updateRows, columnNames } = React.useContext(FilteredRowsContext);

  React.useEffect(() => {
    let map: any = [];
    columnNames.forEach((item: any, index: number) => {
      const value = `${item.group} ${item.name}`;
      map[value] = index;
    })
    setItemToColumnIndexMap(map);
  }, []);

  const handleSearchChange = (value: string) => {
    filterRows(value);
    setSearchValue(value);
  };

  const filterRows = (value: string) => {
    const searchRE = new RegExp(value, 'i');
    const filteredRows = originalRows.filter((row: any) => {
      let found = false;
      if (selected.length === 0) {
        // search all columns
        for (let col of row) {
          if (col && searchRE.test(col.value)) {
            found = true;
            break;
          }
        }
      } else {
        // search only the selected columns
        for (let sel of selected) {
          const columnIndex = itemToColumnIndexMap[sel];
          if (row[columnIndex] && searchRE.test(row[columnIndex].value)) {
            found = true;
            break;
          }
        }
      }
      return found;
    });
    updateRows(filteredRows);
  }

  const onSelectToggle = (isOpen: boolean) => {
    setExpanded(isOpen);
  };

  const onSelect = (event: any, selection: any) => {
    let selections;
    if (selected.includes(selection)) {
      selections = selected.filter((item: any) => item !== selection);
    } else {
      selections = [...selected, selection];
    }
    setSelected(selections);
    // setTimeout(() => {
    //   filterRows(searchValue);
    // }, 1)
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const buildSearchBox = () => {
    return (
      <TextInput
        type="text"
        id="gridSearch"
        name="gridSearch"
        placeholder="Search grid"
        aria-label="Search grid"
        value={searchValue}
        onChange={handleSearchChange}
      />
    );
  };

  const buildSelect = () => {
    let items: any[] = [];
    columnNames.forEach((item: any, index: number) => {
      const value = `${item.group} ${item.name}`;
      items.push(
        <SelectOption key={index} index={index} value={value} />
      );
    })
    return (
      <Select
        variant='checkbox'
        aria-label="Select Input"
        onToggle={onSelectToggle}
        onSelect={onSelect}
        selections={selected}
        isExpanded={isExpanded}
        placeholderText="Filter on column"
        ariaLabelledBy="Filter on column"
      >
        {items}
      </Select>
    );
  };

  return (
    <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
      <ToolbarGroup>
        {originalRows.length === rows.length ? (
          <ToolbarItem>{originalRows.length} items</ToolbarItem>
        ) : (
          <ToolbarItem>{rows.length} of {originalRows.length} items</ToolbarItem>
        )}
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem className="pf-u-mr-xl">{buildSearchBox()}</ToolbarItem>
        <ToolbarItem className="pf-u-mr-md">{buildSelect()}</ToolbarItem>
        {/* <ToolbarItem>
          <Button variant="plain" aria-label="Sort A-Z">
            <SortAlphaDownIcon />
          </Button>
        </ToolbarItem> */}
      </ToolbarGroup>
    </Toolbar>
  );
}

export default EditorToolbar;