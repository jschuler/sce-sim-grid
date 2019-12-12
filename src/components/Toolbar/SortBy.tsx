import * as React from 'react';
import { Select, SelectOption, SelectGroup, SelectVariant } from '@patternfly/react-core';

const SortBy: React.FC<{ 
  rows: any[],
  columnNames: any
}> = ({ rows, columnNames }) => {

  const [state, setState] = React.useState({
    isExpanded: false,
    selected: [] as any[]
  });

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
   * Updates selection on sort select change
   */
  const onSelect = (event: any, currentSelection: any) => {
    setState(prevState => ({
      ...prevState,
      selected: currentSelection,
      isExpanded: false
    }));
  };

  /**
   * Builds the sort select
   */
  const buildSelect = () => {
    let otherItems: any[] = [];
    let givenItems: any[] = [];
    let expectItems: any[] = [];
    const options = [
      { value: 'Choose...', disabled: false, isPlaceholder: true },
      { value: 'Mr', disabled: false },
      { value: 'Miss', disabled: false },
      { value: 'Mrs', disabled: false },
      { value: 'Ms', disabled: false },
      { value: 'Dr', disabled: false },
      { value: 'Other', disabled: false }
    ];
    columnNames.forEach((item: any, index: number) => {
      const value = item.name ? `${item.group} | ${item.name}` : item.group;
      if (item.type === 'OTHER') {
        debugger;
        otherItems.push(<SelectOption key={index} index={index} value={value} isPlaceholder={value === '#'} />);
      } else if (item.type === 'GIVEN') {
        givenItems.push(<SelectOption key={index} index={index} value={value} />);
      } else {
        // EXPECT
        expectItems.push(<SelectOption key={index} index={index} value={value} />);
      }
    });
    const allItems = [...otherItems, ...givenItems, ...expectItems];
    return (
      <Select
        variant={SelectVariant.single}
        aria-label="Sort columns"
        onToggle={onSelectToggle}
        onSelect={onSelect}
        selections={state.selected}
        isExpanded={state.isExpanded}
        ariaLabelledBy="Sort by column"
      >
        {/* {allItems.map((c: any) => c)} */}
        {options.map((option, index) => (
          <SelectOption
            isDisabled={option.disabled}
            key={index}
            value={option.value}
            isPlaceholder={option.isPlaceholder}
          />
        ))}
      </Select>
    );
  };

  return buildSelect();
};

export { SortBy };
