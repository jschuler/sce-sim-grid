import * as React from "react";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from '../Editor';
import { DefinitionsDrawerPanel } from '../Sidebar';
import { getDefinitions, getColumns, getRows, getColumnNames, getDmnFilePath } from "./scesimUtils";
import { getRowColumnFromId } from '../utils';
import { EditorToolbar } from '../Toolbar';
import classNames from 'classnames';

const EditorContainer = React.memo<{ 
  data: any, 
  model: any, 
  showSidePanel?: boolean, 
  readOnly?: boolean 
}>(({ data, model, showSidePanel = true, readOnly = false }) => {
  console.log('render EditorContainer');

  const increaseRows = (rows: any) => {
    // increase rows for performance testing / infinite sroll testing etc
    const enabled = false;
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
    redoList: [],
    skipUpdate: false
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
  const [searchValueState, setSearchValueState] = React.useState('');
  const [filterSelection, setFilterSelection] = React.useState<any[]>([]);
  const [lastForcedUpdateState, setLastForcedUpdateState] = React.useState((Date.now()).toString());

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
        redoList: [],
        skipUpdate: false
      });
      let itemToColumnIndexMap: any = [];
      initialColumnNames.forEach((item: any, index: number) => {
        const value = `${item.group} ${item.name}`;
        itemToColumnIndexMap[value] = index;
      });
      setItemToColumnIndexMap(initialColumnNames);
    }
  }, [data, model]);

  React.useEffect(() => {
    const searchValue = (document.getElementById('gridSearch') as HTMLInputElement).value;
    filterRows(searchValue, filterSelection, allRows);
    if (undoRedo.skipUpdate) {
      return;
    }
    setLastForcedUpdateState((Date.now()).toString());
  }, [ undoRedo ]);

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
    // const clonedAllRows = cloneDeep(allRows);
    allRows[row][column].value = value;
    // setAllRows(allRows);
    // new change clears the redoList
    setUndoRedo((previousState: any) => ({
      undoList: [...previousState.undoList, { id, value, previousValue }],
      redoList: [],
      skipUpdate: true
    }));
  }

  /**
   * Reverts the last Input change
   * Pop the undo stack and push it onto redo stack
   */
  const onUndo = () => {
    if (undoRedo.undoList.length > 0) {
      const clonedChanges = [...undoRedo.undoList];
      const lastChange = clonedChanges.pop();
      setUndoRedo((previousState: any) => ({
        undoList: clonedChanges,
        redoList: [...previousState.redoList, lastChange],
        skipUpdate: false
      }));

      const { id, previousValue } = lastChange;
      const { row, column } = getRowColumnFromId(id);
      allRows[row][column].value = previousValue;
      // let clonedAllRows = cloneDeep(allRows);
      // clonedAllRows[row][column].value = previousValue;
      // setAllRows(clonedAllRows);
      // filterRows(searchValueState, filterSelection, clonedAllRows);
    }
  }

  /**
   * Pop it from the redo stack and push it onto undo stack
   * a new change clears the redo stack
   */
  const onRedo = () => {
    if (undoRedo.redoList.length > 0) {
      const clonedRedoList = [...undoRedo.redoList];
      const lastRedo = clonedRedoList.pop();
      setUndoRedo((previousState: any) => ({
        undoList: [...previousState.undoList, lastRedo],
        redoList: clonedRedoList,
        skipUpdate: false
      }));
      
      const { id, value } = lastRedo;
      const { row, column } = getRowColumnFromId(id);
      allRows[row][column].value = value;
      // const clonedAllRows = cloneDeep(allRows);
      // clonedAllRows[row][column].value = value;
      // setAllRows(clonedAllRows);
      // filterRows(searchValueState, filterSelection, clonedAllRows);
    }
  }

  /**
   * Filter the rows based on search and filter selection
   * Callback function for EditorToolbar, called on filter/search change
   */
  const filterRows = (value: string, selected: any[], rowsToFilter?: any[]) => {
    const rows = rowsToFilter || allRows;
    if (JSON.stringify(filterSelection) !== JSON.stringify(selected)) {
      setFilterSelection(selected);
    }
    if (!value) {
      // no search term, show all rows
      return setFilteredRows(rows);
    }
    const searchRE = new RegExp(value, 'i');
    const filteredRows = rows.filter((row: any) => {
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
    setFilteredRows(filteredRows);
  }

  return (
    <div className="pf-m-redhat-font">
      <div className="pf-c-page">
        <header role="banner" className="pf-c-page__header">
        <div className="pf-c-page__header-brand">
          {showSidePanel && <div className="pf-c-page__header-brand-toggle">
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
          </div>}
          <div className="pf-c-page__header-brand-link">
            {definitions._title}
          </div>
        </div>
          <div className="pf-c-page__header-tools">
            <EditorToolbar 
              data={data}
              allRowsLength={allRows.length} 
              filteredRowsLength={filteredRows.length} 
              filterRows={filterRows} 
              columnNames={columnNames} 
              readOnly={readOnly}
              undoRedo={undoRedo}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          </div>
        </header>
        {showSidePanel && <div className={classNames("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')}>
          <div className="pf-c-page__sidebar-body">
            <DefinitionsDrawerPanel 
              definitions={definitions} 
              dmnFilePath={dmnFilePath} 
            />
          </div>
        </div>}
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
              lastForcedUpdate={lastForcedUpdateState}
              readOnly={readOnly}
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
