import {
  Select,
  SelectGroup,
  SelectOption,
  TextInput,
  ToolbarItem
} from '@patternfly/react-core';
import * as React from 'react';
import { useDebounce } from '../utils';

const Search = React.memo<{
  data: any,
  columnNames: any,
  onChange: any,
}>(({ data, columnNames, onChange }) => {
  // console.log('render Search');

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
  }, [ selected ]);

  React.useEffect(() => {
    // reset search and selection if the underlying data has changed
    setSelected([]);
    setSearchValue('');
  }, [ data ]);

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
  const onSelect = (event: any, currentSelection: any) => {
    let selections: string[];
    if (selected.indexOf(currentSelection) > -1) {
      // was previously selected, now deselect
      selections = selected.filter((item: any) => item !== currentSelection);
    } else {
      // select new
      selections = [...selected, currentSelection];
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
    let otherItems: any[] = [];
    let givenItems: any[] = [];
    let expectItems: any[] = [];
    columnNames.forEach((item: any, index: number) => {
      const value = item.name ? `${item.group} | ${item.name}` : item.group;
      if (item.type === 'OTHER') {
        otherItems.push(<SelectOption key={index} index={index} value={value} />);
      } else if (item.type === 'GIVEN') {
        givenItems.push(<SelectOption key={index} index={index} value={value} />);
      } else {
        // EXPECT
        expectItems.push(<SelectOption key={index} index={index} value={value} />);
      }
    });
    return (
      <Select
        variant="checkbox"
        aria-label="Select Input"
        onToggle={onSelectToggle}
        onSelect={onSelect}
        selections={selected}
        isExpanded={isExpanded}
        placeholderText="Filter on column"
        ariaLabelledBy="Filter on column"
        isGrouped
      >
        <SelectGroup label="Other">{otherItems}</SelectGroup>
        <SelectGroup label="Given">{givenItems}</SelectGroup>
        <SelectGroup label="Expect">{expectItems}</SelectGroup>
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
  if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
    // data has changed, re-render
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
  customName: 'Search',
};

export { Search };
