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

const EditorToolbar = React.memo<{
  data: any,
  allRowsLength: any,
  filteredRowsLength: number,
  filterRows: any,
  columnNames: any,
  undoRedo: any,
  onUndo: any,
  onRedo: any,
  readOnly: boolean,
  onMergeCellsToggle: any
}>(({ data, allRowsLength, filteredRowsLength, filterRows, columnNames, undoRedo, onUndo, onRedo, readOnly, onMergeCellsToggle }) => {
  // console.log('render EditorToolbar');

  const [isModelOpen, setModalOpen] = React.useState(false);
  const [mergeCells, setMergeCells] = React.useState(false);

  const [toolbarStateFromProps, setToolbarStateFromProps] = React.useState({
    data,
    allRowsLength,
    filteredRowsLength,
    columnNames,
    undoRedo,
  });

  React.useEffect(() => {
    // update state from props
    setToolbarStateFromProps({
      data,
      allRowsLength,
      filteredRowsLength,
      columnNames,
      undoRedo,
    });
  }, [
    data,
    allRowsLength,
    filteredRowsLength,
    columnNames,
    undoRedo,
  ]);

  const onSearchChange = (value: string, selected: any[]) => {
    filterRows(value, selected);
  };

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
  
  const mergeCellsToggle = () => {
    const toggledMergeCells = !mergeCells;
    setMergeCells(toggledMergeCells);
    onMergeCellsToggle(toggledMergeCells);
  }

  return (
    <>
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        {!readOnly && <ToolbarGroup>
          <ChangeTracker undoRedo={toolbarStateFromProps.undoRedo} onUndo={onUndo} onRedo={onRedo} />
        </ToolbarGroup>}
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="plain" onClick={mergeCellsToggle}>
              {mergeCells ? <ThLargeIcon size="md" /> : <ThIcon size="md" />}
            </Button>
          </ToolbarItem>
          {toolbarStateFromProps.allRowsLength === filteredRowsLength ? (
            <ToolbarItem className="pf-u-mr-md">{toolbarStateFromProps.allRowsLength} items</ToolbarItem>
          ) : (
            <ToolbarItem className="pf-u-mr-md">{filteredRowsLength} of {toolbarStateFromProps.allRowsLength} items</ToolbarItem>
          )}
          <Search data={data} columnNames={toolbarStateFromProps.columnNames} onChange={onSearchChange} />
          <ToolbarItem><Button variant="plain" onClick={openModal}><OutlinedQuestionCircleIcon size="md" /></Button></ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <HelpModal isOpen={isModelOpen} onClose={closeModal} readOnly={readOnly} />
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.allRowsLength !== nextProps.allRowsLength) {
    // filteredRows have changed, re-render
    return false;
  }
  if (prevProps.filteredRowsLength !== nextProps.filteredRowsLength) {
    // filteredRows have changed, re-render
    return false;
  }
  if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length ||
    JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
    // last changed cell has changed, re-render
    return false;
  }
  if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length ||
    JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
    // last changed cell has changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar',
};

export { EditorToolbar };
