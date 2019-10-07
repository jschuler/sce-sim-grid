import React from 'react';
import {
  Button,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Select,
  SelectOption
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { HelpModal } from './HelpModal';

// const EditorToolbar: React.FC<{ rows: any[] }> = ({ rows: originalRows }) => {
const EditorToolbar = React.memo<{ originalRows: any, rows: any, updateRows: any, columnNames: any }>(({ originalRows, rows, updateRows, columnNames }) => {
  // const { originalRows, rows, updateRows, columnNames } = React.useContext(FilteredRowsContext);
  
  const [isExpanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [isModelOpen, setModalOpen] = React.useState(false);

  let itemToColumnIndexMap: any = [];
  columnNames.forEach((item: any, index: number) => {
    const value = `${item.group} ${item.name}`;
    itemToColumnIndexMap[value] = index;
  });

  React.useEffect(() => {
    console.log('updating filterRows');
    filterRows(searchValue);
  }, [selected]);

  const handleSearchChange = (value: string) => {
    filterRows(value);
    setSearchValue(value);
  };
  
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const filterRows = (value: string, selections?: any[]) => {
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
    debugger;
    updateRows(filteredRows);
    // if (selections) {
    //   setSelected(selections);
    // }
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
    // filterRows(searchValue, selections);
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

  console.log('render EditorToolbar');
  return (
    <>
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
          <ToolbarItem><Button variant="plain" onClick={openModal}><OutlinedQuestionCircleIcon size="md" /></Button></ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <HelpModal isOpen={isModelOpen} onClose={closeModal} />
    </>
  );
}, (prevProps, nextProps) => {
  debugger;
  // TODO: Compare values as well not just length
  if (prevProps.rows.length !== nextProps.rows.length) {
    return false;
  }
  return true;
});

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar'
};

export default EditorToolbar;