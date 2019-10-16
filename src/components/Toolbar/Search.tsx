import React from 'react';
import {
  TextInput,
  ToolbarItem,
  Select,
  SelectOption
} from '@patternfly/react-core';
import { useDebounce } from '../utils';

const Search = React.memo<{ 
  allRows: any,
  columnNames: any,
  onChange: any
}>(({ allRows, columnNames, onChange }) => {
  console.log('render Search');

  const [isExpanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchValue, 500);

  React.useEffect(() => {
    // this gets triggered after the debounce timer
    onChange(debouncedSearchTerm, selected);
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    // When selections in the filter change, update the filtered rows
    if (searchValue) {
      onChange(searchValue, selected);
    }
  }, [selected]);

  React.useEffect(() => {
    // reset search and selection if the underlying data has changed
    setSelected([]);
    setSearchValue('');
  }, [
    allRows
  ]);

  /**
   * Update filtered rows on search change
   */
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  /**
   * Toggles the filter select
   */
  const onSelectToggle = (isOpen: boolean) => {
    setExpanded(isOpen);
  };

  /**
   * Updates selection on filter select change
   */
  const onSelect = (event: any, selection: any) => {
    let selections;
    if (selected.includes(selection)) {
      selections = selected.filter((item: any) => item !== selection);
    } else {
      selections = [...selected, selection];
    }
    setSelected(selections);
  };

  /**
   * Builds the search box
   */
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

  /**
   * Builds the filter select
   */
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
    <>
      <ToolbarItem className="pf-u-mr-md">{buildSearchBox()}</ToolbarItem>
      <ToolbarItem>{buildSelect()}</ToolbarItem>
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.allRows.length !== nextProps.allRows.length || JSON.stringify(prevProps.allRows) !== JSON.stringify(nextProps.allRows)) {
    // allRows have changed, re-render
    return false;
  }
  if (JSON.stringify(prevProps.columnNames) !== JSON.stringify(nextProps.columnNames)) {
    // allRows have changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
Search.whyDidYouRender = {
  customName: 'Search'
};

export { Search };