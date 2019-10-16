import * as React from "react";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from '../Editor';
import { DefinitionsDrawerPanel } from '../Sidebar';
import { getDefinitions, getColumns, getRows, getColumnNames, getDmnFilePath } from "./scesimUtils";
import { getRowColumnFromId } from '../utils';
import { EditorToolbar } from '../Toolbar';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';

const EditorContainer = React.memo<{ data: any, model: any }>(({ data, model }) => {
  // console.log('render EditorContainer');

  const increaseRows = (rows: any) => {
    // increase rows for performance testing / infinite sroll testing etc
    const enabled = true;
    const numRowsToAdd = 2000;
    if (enabled) {
      for (let i = 0; i < numRowsToAdd; i++) {
        const clonedRow = JSON.parse(JSON.stringify(rows[0]));
        // update the Index
        clonedRow[0].value = (i + 6).toString();
        rows.push(clonedRow);
      }
    }
    return rows;
  }

  const initialDefinitions = getDefinitions(model);
  const initialColumns = getColumns(data, true);
  let initialRows = getRows(data, initialColumns);
  initialRows = increaseRows(initialRows);
  const initialColumnNames = getColumnNames(data);
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);
  const [undoRedo, setUndoRedo] = React.useState<any>({ 
    undoList: [], 
    redoList: []
  });
  const [allRows, setAllRows] = React.useState(initialRows);
  const [filteredRows, setFilteredRows] = React.useState(initialRows);
  const [definitions, setDefinitions] = React.useState(initialDefinitions);
  const [dmnFilePath, setDmnFilePath] = React.useState(getDmnFilePath(data));
  const [columns, setColumns] = React.useState(initialColumns);
  const [columnNames, setColumnNames] = React.useState(initialColumnNames);
  let initialItemToColumnIndexMap: any = [];
  initialColumnNames.forEach((item: any, index: number) => {
    const value = `${item.group} ${item.name}`;
    initialItemToColumnIndexMap[value] = index;
  });
  const [itemToColumnIndexMap, setItemToColumnIndexMap] = React.useState(initialItemToColumnIndexMap);
  const [searchValue, setSearchValue] = React.useState('');
  const [filterSelection, setFilterSelection] = React.useState<any[]>([]);

  React.useEffect(() => {
    // when data or model changes, recompute rows and columns
    const updatedDefinitions = getDefinitions(model);
    const updatedColumns = getColumns(data, true);
    let updatedRows = getRows(data, updatedColumns);
    updatedRows = increaseRows(updatedRows);
    if (JSON.stringify(definitions) !== JSON.stringify(updatedDefinitions)) {
      setDefinitions(updatedDefinitions);
    }
    if (JSON.stringify(allRows) !== JSON.stringify(updatedRows)) {
      setDmnFilePath(getDmnFilePath(data));
      setColumns(updatedColumns);
      setColumnNames(getColumnNames(data));
      setAllRows(updatedRows);
      setFilteredRows(updatedRows);
      setUndoRedo({
        undoList: [],
        redoList: []
      });
      let itemToColumnIndexMap: any = [];
      initialColumnNames.forEach((item: any, index: number) => {
        const value = `${item.group} ${item.name}`;
        itemToColumnIndexMap[value] = index;
      });
      setItemToColumnIndexMap(initialColumnNames);
    }
  }, [data, model]);

  /**
   * Toggle the sidebar
   */
  const toggleDrawer = () => {
    setDrawerExpanded(!isDrawerExpanded);
  }

  /** 
   * Callback function for Editor inputs. When they're saved we add it to the list of changes for change-tracking.
   */
  const addToChanges = (id: string, value: string, previousValue: string) => {
    const { row, column } = getRowColumnFromId(id);
    const clonedAllRows = cloneDeep(allRows);
    clonedAllRows[row][column].value = value;
    setAllRows(clonedAllRows);
    // new change clears the redoList
    setUndoRedo({
      undoList: [...undoRedo.undoList, { id, value, previousValue }],
      redoList: []
    });
  }

  /**
   * Reverts the last Input change
   * Pop the undo stack and push it onto redo stack
   */
  const onUndo = () => {
    if (undoRedo.undoList.length > 0) {
      const clonedChanges = cloneDeep(undoRedo.undoList);
      const lastChange = clonedChanges.pop();
      const { id, previousValue } = lastChange;
      const { row, column } = getRowColumnFromId(id);
      const clonedAllRows = cloneDeep(allRows);
      clonedAllRows[row][column].value = previousValue;
      setAllRows(clonedAllRows);
      setUndoRedo({
        undoList: clonedChanges,
        redoList: [...undoRedo.redoList, lastChange]
      });
    }
  }

  /**
   * Pop it from the redo stack and push it onto undo stack
   * a new change clears the redo stack
   */
  const onRedo = () => {
    if (undoRedo.redoList.length > 0) {
      const clonedRedoList = cloneDeep(undoRedo.redoList);
      const lastRedo = clonedRedoList.pop();
      const { id, value } = lastRedo;
      const { row, column } = getRowColumnFromId(id);
      const clonedAllRows = cloneDeep(allRows);
      clonedAllRows[row][column].value = value;
      setAllRows(clonedAllRows);
      setUndoRedo({
        undoList: [...undoRedo.undoList, lastRedo],
        redoList: clonedRedoList
      });
    }
  }

  React.useEffect(() => {
    filterRows(searchValue, filterSelection);
  }, [allRows]);

  /**
   * Filter the rows based on search and filter selection
   * Callback function for EditorToolbar, called on filter/search change
   */
  const filterRows = (value: string, selected: any[]) => {
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
    setSearchValue(value);
    setFilterSelection(selected);
    setFilteredRows(filteredRows);
  }

  return (
    <div className="pf-m-redhat-font">
      <div className="pf-c-page">
        <header role="banner" className="pf-c-page__header">
        <div className="pf-c-page__header-brand">
          <div className="pf-c-page__header-brand-toggle">
            <Button
              id="nav-toggle"
              onClick={toggleDrawer}
              aria-label="Toggle drawer"
              aria-controls="page-sidebar"
              aria-expanded={isDrawerExpanded ? 'true' : 'false'}
              variant="plain"
            >
              <BarsIcon />
            </Button>
          </div>
          <div className="pf-c-page__header-brand-link">
            {definitions._title}
          </div>
        </div>
          <div className="pf-c-page__header-tools">
            <EditorToolbar 
              allRows={allRows} 
              filteredRowsLength={filteredRows.length} 
              filterRows={filterRows} 
              columnNames={columnNames} 
              changes={undoRedo.undoList} 
              redoList={undoRedo.redoList}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          </div>
        </header>
        <div className={classNames("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')}>
          <div className="pf-c-page__sidebar-body">
            <DefinitionsDrawerPanel 
              definitions={definitions} 
              dmnFilePath={dmnFilePath} 
            />
          </div>
        </div>
        <main role="main" className="pf-c-page__main" id="sce-sim-grid__main" tabIndex={-1}>
          <section className="pf-c-page__main-section pf-m-light">
            <Editor 
              columns={columns} 
              filteredRows={filteredRows} 
              definitions={definitions} 
              columnNames={columnNames} 
              onSave={addToChanges}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          </section>
        </main>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
    // data has changed, re-render
    return false;
  }
  if (JSON.stringify(prevProps.model) !== JSON.stringify(nextProps.model)) {
    // model has changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
EditorContainer.whyDidYouRender = {
  customName: 'EditorContainer'
};

export { EditorContainer };
