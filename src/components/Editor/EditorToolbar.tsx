import React from 'react';
import {
  Button,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Select,
  SelectOption,
  Expandable
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon, UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { HelpModal } from './HelpModal';
import './EditorToolbar.scss';

const EditorToolbar = React.memo<{ 
  originalRows: any, 
  rows: any, 
  updateRows: any, 
  columnNames: any,
  changes: any[],
  onUndo: any
}>(({ originalRows, rows, updateRows, columnNames, changes, onUndo }) => {
  
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
    if (searchValue) {
      console.log('updating filterRows');
      filterRows(searchValue);
    }
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
  console.log(`changes: ${changes}`);

  const getChangeText = () => {
    if (changes.length === 1) {
      return `1 change`;
    } else {
      return `${changes.length} changes`;
    }
  };

  const focusElement = (id: string) => {
    const element = document.getElementById(id) as HTMLInputElement;
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      console.log(`focusing ${id}`);
      setTimeout(() => {
        element.focus();
      }, 1000)
    }
  }

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
        <Expandable toggleText={getChangeText()} className="kie-changes">
          <div className="pf-c-content">
            <dl>
              {changes.map((change: any) => (
                <>
                  <dt><Button variant="link" onClick={() => focusElement(change.id)} isInline>{change.id}</Button></dt>
                  <dd>{change.value}</dd>
                </>
              ))}
            </dl>
          </div>
        </Expandable>
      );
    } else {
      return input;
    }
  }

  const undoChange = () => {
    console.log('undo');
    onUndo(changes[0]);
  };

  return (
    <>
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ToolbarItem>
            <div className="pf-c-input-group">
              <Button onClick={undoChange} variant="control" isDisabled={changes.length === 0}>
                <UndoIcon />
              </Button>
              {changeTracker()}
              <Button variant="control" isDisabled>
                <RedoIcon />
              </Button>
            </div>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          {originalRows.length === rows.length ? (
            <ToolbarItem className="pf-u-mr-md">{originalRows.length} items</ToolbarItem>
          ) : (
            <ToolbarItem className="pf-u-mr-md">{rows.length} of {originalRows.length} items</ToolbarItem>
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
  // TODO: Compare values as well not just length
  if (prevProps.rows.length !== nextProps.rows.length) {
    return false;
  }
  if (prevProps.changes !== nextProps.changes) {
    return false;
  }
  return true;
});

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar'
};

export default EditorToolbar;