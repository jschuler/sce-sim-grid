import React from 'react';
import {
  Button,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Select,
  SelectOption,
  Expandable,
  debounce
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { HelpModal } from './HelpModal';
import { focusCell } from './utils';
import './EditorToolbar.scss';

const EditorToolbar = React.memo<{ 
  allRows: any, 
  rows: any, 
  updateRows: any, 
  columnNames: any,
  changes: any[],
  onUndo: any
}>(({ allRows, rows, updateRows, columnNames, changes, onUndo }) => {
  console.log('render EditorToolbar');

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
    // When selections in the filter change, update the filtered rows
    if (searchValue) {
      filterRows(searchValue);
    }
  }, [selected]);

  /**
   * Update filtered rows on search change
   */
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // @ts-ignore
    debouncedFilterRows(value);
  };

  const debouncedFilterRows = debounce((value: any) => {
    filterRows(value)
  }, 1000);
  
  /**
   * Opens the Help modal
   */
  const openModal = () => {
    setModalOpen(true);
  };

  /**
   * Closes the Help modal
   */
  const closeModal = () => {
    setModalOpen(false);
  };

  /**
   * Filter the rows based on search and filter selection
   */
  const filterRows = (value: string, selections?: any[]) => {
    const searchRE = new RegExp(value, 'i');
    const filteredRows = allRows.filter((row: any) => {
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

  /**
   * The text to display for the change-tracker
   */
  const getChangeText = () => {
    if (changes.length === 1) {
      return `1 change`;
    } else {
      return `${changes.length} changes`;
    }
  };

  /**
   * When a cell id is clicked in the change-tracker, it scrolls and focuses the corresponding element in the grid
   */
  const focusElement = (id: string) => {
    focusCell(id, 250, true);
  }

  /**
   * The change-tracker element
   */
  const changeTracker = () => {
    const input = (
      <input 
        className="pf-c-form-control" 
        type="button" 
        id="textInput10" 
        name="textInput10" 
        aria-label="Input example with popover" 
        value={getChangeText()}
      />
    );
    if (changes.length) {
      return (
        <Expandable toggleText={getChangeText()} className="kie-changes pf-u-mx-sm">
          <div className="pf-c-content">
            <dl>
              {changes.map((change: any, index: number) => (
                <React.Fragment key={index}>
                  <dt><Button variant="link" onClick={() => focusElement(change.id)} isInline>{change.id}</Button></dt>
                  <dd>{change.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Expandable>
      );
    } else {
      return input;
    }
  }

  /**
   * Undoes the last change
   */
  const undoChange = () => {
    onUndo(changes[0]);
  };

  return (
    <>
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ToolbarItem>
            <div className="pf-c-input-group">
              {/* <Button onClick={undoChange} variant="control" isDisabled={changes.length === 0}>
                <UndoIcon />
              </Button> */}
              {changeTracker()}
              {/* <Button variant="control" isDisabled>
                <RedoIcon />
              </Button> */}
            </div>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          {allRows.length === rows.length ? (
            <ToolbarItem className="pf-u-mr-md">{allRows.length} items</ToolbarItem>
          ) : (
            <ToolbarItem className="pf-u-mr-md">{rows.length} of {allRows.length} items</ToolbarItem>
          )}
          <ToolbarItem className="pf-u-mr-md">{buildSearchBox()}</ToolbarItem>
          <ToolbarItem>{buildSelect()}</ToolbarItem>
          <ToolbarItem><Button variant="plain" onClick={openModal}><OutlinedQuestionCircleIcon size="md" /></Button></ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <HelpModal isOpen={isModelOpen} onClose={closeModal} />
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.rows.length !== nextProps.rows.length || JSON.stringify(prevProps.rows) !== JSON.stringify(nextProps.rows)) {
    // rows have changed, re-render
    return false;
  }
  if (prevProps.changes.length !== nextProps.changes.length || JSON.stringify(prevProps.changes) !== JSON.stringify(nextProps.changes)) {
    // last changed cell has changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar'
};

export default EditorToolbar;