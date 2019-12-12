import {
  Select,
  SelectGroup,
  SelectOption,
  TextInput,
  ToolbarItem
} from '@patternfly/react-core';
import * as React from 'react';
import { useDebounce } from '../utils';

const Search: React.FC<{ 
  data: any,
  rows: any[],
  columnNames: any,
  onChange: any,
  lastFiltersClear: string
}> = ({ 
  data, rows, columnNames, onChange, lastFiltersClear
}) => {
  // console.log('render Search');

  const [state, setState] = React.useState({
    isExpanded: false,
    selected: [] as any[],
    searchValue: ''
  });

  const debouncedSearchTerm = useDebounce(state.searchValue, 500);

  React.useEffect(() => {
    // this gets triggered after the debounce timer
    onChange(debouncedSearchTerm, state.selected);
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    debugger;
    // When selections in the filter change, update the filtered rows
    if (state.searchValue) {
      onChange(state.searchValue, state.selected);
    }
  }, [ state.selected ]);

  React.useEffect(() => {
    // reset search and selection if the underlying data has changed
    setState(prevState => ({
      ...prevState,
      selected: [],
      searchValue: ''
    }));
  }, [ data, lastFiltersClear ]);

  /**
   * Update filtered rows on search change
   */
  const handleSearchChange = (value: string) => {
    setState(prevState => ({
      ...prevState,
      searchValue: value
    }));
  };

  /**
   * Toggles the filter select
   */
  const onSelectToggle = (isOpen: boolean) => {
    setState(prevState => ({
      ...prevState,
      isExpanded: isOpen
    }));
  };

  /**
   * Updates selection on filter select change
   */
  const onSelect = (event: any, currentSelection: any) => {
    let selections: string[];
    if (state.selected.indexOf(currentSelection) > -1) {
      // was previously selected, now deselect
      selections = state.selected.filter((item: any) => item !== currentSelection);
    } else {
      // select new
      selections = [...state.selected, currentSelection];
    }
    setState(prevState => ({
      ...prevState,
      selected: selections
    }));
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
        value={state.searchValue}
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
        selections={state.selected}
        isExpanded={state.isExpanded}
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
};

// @ts-ignore
Search.whyDidYouRender = {
  customName: 'Search',
};

export { Search };
