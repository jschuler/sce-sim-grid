import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon, ThIcon, ThLargeIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { ChangeTracker } from './ChangeTracker';
import './EditorToolbar.css';
import { HelpModal } from './HelpModal';
import { Search } from './Search';
import { SortBy } from './SortBy';

const EditorToolbar: React.FC<{ 
  data: any,
  rows: any[],
  filterRows: any,
  setSearchState: any,
  columnNames: any,
  undoRedo: any,
  onUndo: any,
  onRedo: any,
  readOnly: boolean,
  mergeCells: boolean,
  onMergeCellsToggle: any,
  lastFiltersClear: string,
}> = ({ 
  data, rows, filterRows, setSearchState, columnNames, undoRedo, onUndo, onRedo, readOnly, mergeCells, onMergeCellsToggle, lastFiltersClear
}) => {
  // console.log('render EditorToolbar');

  const [state, setState] = React.useState({
    isModalOpen: false,
    mergeCells: false
  });

  const onSearchChange = (value: string, selected: any[]) => {
    setSearchState(value, selected);
  };

  /**
   * Opens the Help modal
   */
  const openModal = () => {
    setState(prevState => ({
      ...prevState,
      isModalOpen: true
    }));
  };

  /**
   * Closes the Help modal
   */
  const closeModal = () => {
    setState(prevState => ({
      ...prevState,
      isModalOpen: false
    }));
  };
  
  const mergeCellsToggle = () => {
    const toggledMergeCells = !state.mergeCells;
    setState(prevState => ({
      ...prevState,
      mergeCells: toggledMergeCells
    }));
    onMergeCellsToggle(toggledMergeCells);
  }

  return (
    <>
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="plain" onClick={mergeCellsToggle}>
              {state.mergeCells ? <ThLargeIcon size="md" /> : <ThIcon size="md" />}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        {!readOnly && <ToolbarGroup>
          <ChangeTracker undoRedo={undoRedo} onUndo={onUndo} onRedo={onRedo} />
        </ToolbarGroup>}
        <ToolbarGroup>
          {/* <ToolbarItem>
            <SortBy 
              rows={rows} 
              columnNames={columnNames} 
            />
          </ToolbarItem> */}
          {rows.length === filterRows(rows).length ? (
            <ToolbarItem className="pf-u-mr-md">{rows.length} items</ToolbarItem>
          ) : (
            <ToolbarItem className="pf-u-mr-md">{filterRows(rows).length} of {rows.length} items</ToolbarItem>
          )}
          <Search 
            data={data} 
            rows={rows} 
            columnNames={columnNames} 
            onChange={onSearchChange} 
            lastFiltersClear={lastFiltersClear}
          />
          <ToolbarItem><Button variant="plain" onClick={openModal}><OutlinedQuestionCircleIcon size="md" /></Button></ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <HelpModal isOpen={state.isModalOpen} onClose={closeModal} readOnly={readOnly} />
    </>
  );
};

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar',
};

export { EditorToolbar };
