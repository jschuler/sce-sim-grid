import React from 'react';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { HelpModal } from './HelpModal';
import { Search } from './Search';
import { ChangeTracker } from './ChangeTracker';
import './EditorToolbar.scss';

const EditorToolbar = React.memo<{ 
  allRows: any, 
  filteredRowsLength: number, 
  filterRows: any, 
  columnNames: any,
  changes: any[],
  redoList: any[],
  onUndo: any,
  onRedo: any
}>(({ allRows, filteredRowsLength, filterRows, columnNames, changes, redoList, onUndo, onRedo }) => {
  console.log('render EditorToolbar');

  const [isModelOpen, setModalOpen] = React.useState(false);

  const [toolbarStateFromProps, setToolbarStateFromProps] = React.useState({ 
    allRows, 
    filteredRowsLength, 
    columnNames, 
    changes,
    redoList
  });

  React.useEffect(() => {
    // update state from props
    setToolbarStateFromProps({
      allRows, 
      filteredRowsLength, 
      columnNames, 
      changes,
      redoList
    });

    // let updatedItemToColumnIndexMap: any = [];
    // columnNames.forEach((item: any, index: number) => {
    //   const value = `${item.group} ${item.name}`;
    //   updatedItemToColumnIndexMap[value] = index;
    // });
    // setItemToColumnIndexMap(updatedItemToColumnIndexMap);
  }, [
    allRows, 
    filteredRowsLength, 
    columnNames, 
    changes,
    redoList
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

  return (
    <>
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ChangeTracker changes={toolbarStateFromProps.changes} redoList={toolbarStateFromProps.redoList} onUndo={onUndo} onRedo={onRedo} />
        </ToolbarGroup>
        <ToolbarGroup>
          {toolbarStateFromProps.allRows.length === filteredRowsLength ? (
            <ToolbarItem className="pf-u-mr-md">{toolbarStateFromProps.allRows.length} items</ToolbarItem>
          ) : (
            <ToolbarItem className="pf-u-mr-md">{filteredRowsLength} of {toolbarStateFromProps.allRows.length} items</ToolbarItem>
          )}
          <Search allRows={toolbarStateFromProps.allRows} columnNames={toolbarStateFromProps.columnNames} onChange={onSearchChange} />
          <ToolbarItem><Button variant="plain" onClick={openModal}><OutlinedQuestionCircleIcon size="md" /></Button></ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <HelpModal isOpen={isModelOpen} onClose={closeModal} />
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.allRows.length !== nextProps.allRows.length || JSON.stringify(prevProps.allRows) !== JSON.stringify(nextProps.allRows)) {
    // filteredRows have changed, re-render
    return false;
  }
  if (prevProps.filteredRowsLength !== nextProps.filteredRowsLength) {
    // filteredRows have changed, re-render
    return false;
  }
  if (prevProps.changes.length !== nextProps.changes.length || JSON.stringify(prevProps.changes) !== JSON.stringify(nextProps.changes)) {
    // last changed cell has changed, re-render
    return false;
  }
  if (prevProps.redoList.length !== nextProps.redoList.length || JSON.stringify(prevProps.redoList) !== JSON.stringify(nextProps.redoList)) {
    // last changed cell has changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
EditorToolbar.whyDidYouRender = {
  customName: 'EditorToolbar'
};

export { EditorToolbar };