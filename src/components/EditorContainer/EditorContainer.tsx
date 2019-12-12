import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import classNames from 'classnames';
import * as React from 'react';
import { Editor } from '../Editor';
import { DefinitionsDrawerPanel } from '../Sidebar';
import { EditorToolbar } from '../Toolbar';
import { getRowColumnFromId, getJsonFromSceSim, getJsonFromDmn, useKeyPress } from '../utils';
import { getColumnNames, getColumns, getDefinitions, getDmnFilePath, getDmnName, getRows } from './scesimUtils';

const EditorContainer: React.FC<{ 
  /**
   * scesim data
   */
  data: string,
  /**
   * Optional DMN model
   */
  model?: string,
  /**
   * Whether to display the sidebar
   */
  showSidePanel?: boolean,
  /**
   * True to make the editor read-only
   */
  readOnly?: boolean
}> = ({ 
  data, model, showSidePanel = true, readOnly = false
}) => {
  // console.log('render EditorContainer');

  /**
   * Helper function to increase rows for performance testing / infinite sroll testing etc
   * @param rows 
   */
  const increaseRows = (rows: any) => {
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
  };

  const computeCellMerges = (rows: any, column?: number) => {
    let i;
    let currentMaster;
    let currentCell;
    let previousCell;
    if (rows && rows.length > 1) {
      if (column !== undefined) {
        // initialize the column's first cell as master
        currentMaster = rows[0][column];
        currentMaster.master = true;
        currentMaster.follower = false;
        currentMaster.coverCells = 1;

        for (i = 1; i < rows.length; i++) {
          // compareAndModifyCells(rows[i][column], rows[i - 1][column], currentMaster);
          currentCell = rows[i][column];
          previousCell = rows[i - 1][column];
          if (currentCell.value === previousCell.value) {
            // mark this cell a follower
            currentCell.follower = true;
            // increase the master cell's coverCells amount
            currentMaster.coverCells += 1;
          } else {
            // this is the new master cell
            currentMaster = currentCell;
            currentMaster.master = true;
            currentMaster.follower = false;
            currentMaster.coverCells = 1;
          }
        }
      } else {
        const numColumns = rows[0].length;
        // iterate through all the columns
        for (i = 1; i < numColumns; i++) {
          // initialize the column's first cell as master
          currentMaster = rows[0][i];
          currentMaster.master = true;
          currentMaster.follower = false;
          currentMaster.coverCells = 1;
          // compare cell values along the same column
          for (let j = 1; j < rows.length; j++) {
            // compareAndModifyCells(rows[j][i], rows[j - 1][i], currentMaster);
            currentCell = rows[j][i];
            previousCell = rows[j - 1][i];
            if (currentCell.value === previousCell.value) {
              // mark this cell a follower
              currentCell.follower = true;
              // increase the master cell's coverCells amount
              currentMaster.coverCells += 1;
            } else {
              // this is the new master cell
              currentMaster = currentCell;
              currentMaster.master = true;
              currentMaster.follower = false;
              currentMaster.coverCells = 1;
            }
          }
        }
      }
    }
    return rows;
  }

  const dataJson = getJsonFromSceSim(data);
  const initialColumns = getColumns(dataJson, true);
  let initialRows = getRows(dataJson, initialColumns);
  initialRows = increaseRows(initialRows);
  const initialColumnNames = getColumnNames(dataJson);
  let initialItemToColumnIndexMap: any = {};
  initialColumnNames.forEach((item: any, index: number) => {
    const value = item.name ? `${item.group} | ${item.name}` : item.group;
    initialItemToColumnIndexMap[value] = index;
  });
  // optional model
  const initialDefinitions = model ? getDefinitions(getJsonFromDmn(model)) : null;

  const [state, setState] = React.useState({
    dataJson,
    isDrawerExpanded: true,
    undoRedo: {
      undoList: [] as any[],
      redoList: [] as any[],
      skipUpdate: false
    },
    allRows: initialRows,
    filteredRows: initialRows,
    dmnFilePath: getDmnFilePath(dataJson),
    dmnName: getDmnName(dataJson),
    columns: initialColumns,
    mergeCells: false,
    columnNames: initialColumnNames,
    itemToColumnIndexMap: initialItemToColumnIndexMap,
    filterSelection: [] as any[],
    lastForcedUpdateState: (Date.now()).toString(),
    lastFiltersClear: (Date.now()).toString(),
    definitions: initialDefinitions,
    searchValue: '',
    searchSelections: [] as any[]
  });

  const clearFilters = () => {
    setState(prevState => ({
      ...prevState,
      searchValue: '',
      searchSelections: [],
      lastFiltersClear: (Date.now()).toString()
    }));
  }

  React.useEffect(() => {
    // when data or model changes, recompute rows and columns
    const dataJson = getJsonFromSceSim(data);
    const updatedColumns = getColumns(dataJson, true);
    let updatedRows = getRows(dataJson, updatedColumns);
    updatedRows = increaseRows(updatedRows);

    // pre-compute which cells are master cells and which are followers
    updatedRows = computeCellMerges(updatedRows);
    
    if (JSON.stringify(state.allRows) !== JSON.stringify(updatedRows)) {
      let itemToColumnIndexMap: any = {};
      initialColumnNames.forEach((item: any, index: number) => {
        const value = item.name ? `${item.group} | ${item.name}` : item.group;
        itemToColumnIndexMap[value] = index;
      });

      // update the optional model
      const updatedDefinitions = model ? getDefinitions(getJsonFromDmn(model)): null;

      setState(prevState => ({
        ...prevState,
        dmnFilePath: getDmnFilePath(dataJson),
        columns: updatedColumns,
        columnNames: getColumnNames(dataJson),
        allRows: updatedRows,
        filteredRows: updatedRows,
        undoRedo: {
          undoList: [],
          redoList: [],
          skipUpdate: false,
        },
        itemToColumnIndexMap,
        definitions: JSON.stringify(state.definitions) !== JSON.stringify(updatedDefinitions) ? updatedDefinitions : state.definitions
      }));
    }
  }, [data, model]);

  /**
   * Toggle the sidebar
   */
  const toggleDrawer = () => {
    setState(prevState => ({
      ...prevState,
      isDrawerExpanded: !state.isDrawerExpanded
    }));
  };

  type Change = {
    id: string, // row and column
    rowId: string, // the first column value
    value: any, 
    previousValue: any,
    withRows?: Change[]
  };

  const updateRows = (rows: any[], change: Change, isUndo = false) => {
    return computeCellMerges(rows.map((row: any[]) => {
      // row[0] is the row id
      const currentRowId = row[0].value;
      let updatedRow = row;
      if (change.rowId === currentRowId) {
        const { column } = getRowColumnFromId(change.id);
        updatedRow[column].value = isUndo ? change.previousValue : change.value;
      } else if (change.withRows) {
        // the current row should also be updated
        const foundChange = change.withRows.find(subChange => subChange.rowId === currentRowId);
        if (foundChange) {
          const { column } = getRowColumnFromId(foundChange.id);
          updatedRow[column].value = isUndo ? foundChange.previousValue : foundChange.value;
        }
      }
      return updatedRow;
    }), getRowColumnFromId(change.id).column);
  }

  /**
   * Callback function for Editor inputs. When they're saved we add it to the list of changes for change-tracking.
   */
  const addToChanges = (cellId: string, value: string, previousValue: string, rowId: string) => {
    const { column } = getRowColumnFromId(cellId);

    let change: Change = { 
      id: cellId, 
      rowId: rowId,
      value, 
      previousValue
    };

    debugger;
    

    const computedAndFilteredRows = computeCellMerges(filterRows(state.allRows));

    if (state.mergeCells) {
      for (let index = 0; index < computedAndFilteredRows.length; index++) {
        if (computedAndFilteredRows[index][0].value === rowId) {
          console.log(`changing ${computedAndFilteredRows[index][column].value} to ${value}`);
          if (computedAndFilteredRows[index][column].master) {
            // update the follower cells as well
            let relatedChanges: Change[] = [];
            for (let i = index + 1; i < computedAndFilteredRows.length; i++) {
              if (computedAndFilteredRows[i][column].follower) {
                console.log(`also changing ${computedAndFilteredRows[i][column].value} to ${value}`);
                relatedChanges.push({
                  id: `row ${i} column ${column}`,
                  rowId: computedAndFilteredRows[i][0].value,
                  value,
                  previousValue
                });
              } else {
                break;
              }
            }
            change['withRows'] = relatedChanges;
          }
        }
      }
    }

    // new change clears the redoList
    setState(prevState => ({
      ...prevState,
      undoRedo: {
        undoList: [...prevState.undoRedo.undoList, change],
        redoList: [],
        skipUpdate: true
      },
      allRows: updateRows(prevState.allRows, change)
    }));
  };

  /**
   * Reverts the last Input change
   * Pop the undo stack and push it onto redo stack
   */
  const onUndo = () => {
    if (state.undoRedo.undoList.length > 0) {
      const clonedChanges = [...state.undoRedo.undoList];
      const lastChange = clonedChanges.pop();
      setState(prevState => ({
        ...prevState,
        undoRedo: {
          undoList: clonedChanges,
          redoList: [...prevState.undoRedo.redoList, lastChange],
          skipUpdate: false
        },
        allRows: updateRows(prevState.allRows, lastChange, true)
      }));
    }
  };

  /**
   * Pop it from the redo stack and push it onto undo stack
   * a new change clears the redo stack
   */
  const onRedo = () => {
    if (state.undoRedo.redoList.length > 0) {
      const clonedRedoList = [...state.undoRedo.redoList];
      const lastRedo = clonedRedoList.pop();
      setState(prevState => ({
        ...prevState,
        undoRedo: {
          undoList: [...prevState.undoRedo.undoList, lastRedo],
          redoList: clonedRedoList,
          skipUpdate: false
        },
        allRows: updateRows(prevState.allRows, lastRedo)
      }));
    }
  };

  const onMergeCellsToggle = (shouldMergeCells: boolean) => {
    setState(prevState => ({
      ...prevState,
      mergeCells: shouldMergeCells
    }));
  }

  // disable the native browser implementation of undo / redo
  let ctrlDown = false;
  const zKey = 90;
  const yKey = 89;
  document.body.onkeydown = function(e) {
    if (e.ctrlKey || e.metaKey) {
      ctrlDown = true;
    }
    if ((ctrlDown && e.keyCode === zKey) || (ctrlDown && e.keyCode === yKey)) {
      e.preventDefault();
      return false;
    }
  }
  
  // Command + Z / CTRL + Z undo the last change
  useKeyPress(/z/i, onUndo, { log: 'editor-container', withModifier: true, isActive: !readOnly });
  // Command + Shift + Z redo the last change (Mac)
  useKeyPress(/z/i, onRedo, { log: 'editor-container', withModifier: true, withShift: true, isActive: !readOnly });
  // CTRL + Y redo the last change (Windows)
  useKeyPress(/y/i, onRedo, { log: 'editor-container', withModifier: true, withShift: false, isActive: !readOnly });

  const setSearchState = (value: string, selected: any[]) => {
    setState(prevState => ({
      ...prevState,
      searchValue: value,
      searchSelections: selected
    }));
  }

  /**
   * Filter the rows based on search and filter selection
   */
  const filterRows = (rows: any[]) => {
    if (!state.searchValue) {
      // no search term, show all rows
      return rows;
    }
    const searchRE = new RegExp(state.searchValue, 'i');
    const rowsAfterFilter = rows.filter((row: any) => {
      let found = false;
      if (state.searchSelections.length === 0) {
        // search all columns
        for (const col of row) {
          if (col && searchRE.test(col.value)) {
            found = true;
            break;
          }
        }
      } else {
        // search only the selected columns
        for (const sel of state.searchSelections) {
          const columnIndex = state.itemToColumnIndexMap[sel];
          if (row[columnIndex] && searchRE.test(row[columnIndex].value)) {
            found = true;
            break;
          }
        }
      }
      return found;
    });
    return rowsAfterFilter;
  };

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
              aria-expanded={state.isDrawerExpanded ? 'true' : 'false'}
              variant="plain"
            >
              <BarsIcon />
            </Button>
          </div>}
          <div className="pf-c-page__header-brand-link">
            {(state.definitions && state.definitions._title) || state.dmnName}
          </div>
        </div>
          <div className="pf-c-page__header-tools">
            <EditorToolbar
              data={data}
              rows={state.allRows}
              filterRows={filterRows}
              lastFiltersClear={state.lastFiltersClear}
              setSearchState={setSearchState}
              columnNames={state.columnNames}
              readOnly={readOnly}
              undoRedo={state.undoRedo}
              onUndo={onUndo}
              onRedo={onRedo}
              mergeCells={state.mergeCells}
              onMergeCellsToggle={onMergeCellsToggle}
            />
          </div>
        </header>
        {showSidePanel && state.definitions && <div className={classNames('pf-c-page__sidebar pf-m-dark', state.isDrawerExpanded && 'pf-m-expanded', !state.isDrawerExpanded && 'pf-m-collapsed')}>
          <div className="pf-c-page__sidebar-body">
            <DefinitionsDrawerPanel
              definitions={state.definitions}
              dmnFilePath={state.dmnFilePath}
            />
          </div>
        </div>}
        <main role="main" className="pf-c-page__main" id="sce-sim-grid__main" tabIndex={-1}>
          <section className="pf-c-page__main-section pf-m-light">
            <Editor
              columns={state.columns}
              rows={state.allRows}
              filterRows={filterRows}
              searchValue={state.searchValue}
              searchSelections={state.searchSelections}
              filteredRows={state.filteredRows}
              definitions={state.definitions}
              columnNames={state.columnNames}
              onSave={addToChanges}
              lastForcedUpdate={state.lastForcedUpdateState}
              readOnly={readOnly}
              mergeCells={state.mergeCells}
              computeCellMerges={computeCellMerges}
              onClearFilters={clearFilters}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

// @ts-ignore
EditorContainer.whyDidYouRender = {
  customName: 'EditorContainer',
};

export { EditorContainer };
