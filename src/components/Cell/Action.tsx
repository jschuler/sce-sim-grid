import * as React from 'react';
import { Dropdown, DropdownPosition, KebabToggle, DropdownItem } from '@patternfly/react-core';

const Action: React.FC<{ rowIndex: number, onInsertRowAbove: any, onInsertRowBelow: any }> = ({ rowIndex, onInsertRowAbove, onInsertRowBelow }) => {

  const [isOpen, setOpen] = React.useState(false);

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const onSelect = (event: any) => {
    const { id } = event.currentTarget;
    console.log(`selected ${id} at row ${rowIndex}`);
    if (id === 'insertRowAbove') {
      onInsertRowAbove(rowIndex);
    } else {
      onInsertRowBelow(rowIndex);
    }
    setOpen(false);
  };
  
  return (
    <Dropdown
      isPlain
      position={DropdownPosition.right}
      isOpen={isOpen}
      onSelect={onSelect}
      toggle={<KebabToggle onToggle={onToggle} />}
      dropdownItems={[
        <DropdownItem id="insertRowAbove" key="insert_row_above" component="button">
          Insert row above
        </DropdownItem>,
        <DropdownItem id="insertRowBelow" key="insert_row_below" component="button">
          Insert row below
        </DropdownItem>
      ]}
    />
  );
};

export { Action };
