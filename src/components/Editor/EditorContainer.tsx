import * as React from "react";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from './Editor';
import { DefinitionsDrawerPanel } from './DrawerPanel';
import { getDefinitions, getColumns, getRows, getColumnNames, getDmnFilePath } from "./utils";
import EditorToolbar from './EditorToolbar';
import classNames from 'classnames';

export const FilteredRowsContext = React.createContext<{
  columns: any,
  allRows: any[],
  rows: any[], 
  updateRows?: any, 
  definitions?: any,
  columnNames?: any
}>({
  columns: null,
  allRows: [],
  rows: [], 
  updateRows: null, 
  definitions: null,
  columnNames: null
});

export const TrackChangesContext = React.createContext<{
  changes: any[]
}>({
  changes: []
});

const EditorContainer = React.memo<{ data: any, model: any }>(({ data, model }) => {
  const initialDefinitions = getDefinitions(model);
  const initialColumns = getColumns(data, true);
  const initialRows = getRows(data, initialColumns);
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);
  const [changes, setChanges] = React.useState<any[]>([]);
  const [lastChangedCell, setLastChangedCell] = React.useState('');
  const [allRows, setAllRows] = React.useState(initialRows);
  const [filteredRows, setFilteredRows] = React.useState(initialRows);
  const [definitions, setDefinitions] = React.useState(initialDefinitions);
  const [dmnFilePath, setDmnFilePath] = React.useState(getDmnFilePath(data));
  const [columns, setColumns] = React.useState(initialColumns);
  const [columnNames, setColumnNames] = React.useState(getColumnNames(data));

  React.useEffect(() => {
    // when data or model changes, recompute rows and columns
    const updatedDefinitions = getDefinitions(model);
    const updatedColumns = getColumns(data, true);
    const updatedRows = getRows(data, updatedColumns);
    if (JSON.stringify(definitions) !== JSON.stringify(updatedDefinitions)) {
      console.log('updating definitions');
      setDefinitions(updatedDefinitions);
    }
    if (JSON.stringify(allRows) !== JSON.stringify(updatedRows)) {
      console.log('updating rows and columns');
      setDmnFilePath(getDmnFilePath(data));
      setColumns(updatedColumns);
      setColumnNames(getColumnNames(data));
      setAllRows(updatedRows);
      setFilteredRows(updatedRows);
    }

    // for (let i = 0; i < 2000; i++) {
    //   const clonedArray = JSON.parse(JSON.stringify(allRows[0]))
    //   clonedArray[0].value = (i + 6).toString();
    //   allRows.push(clonedArray);
    // }
  }, [data, model]);

  const updateRows = (rows: any) => {
    setFilteredRows(rows);
  }

  const toggleDrawer = () => {
    setDrawerExpanded(!isDrawerExpanded);
  }

  const addToChanges = (id: string, value: string, previousValue: string) => {
    setChanges((prevState: any) => ([...prevState, { id, value, previousValue }]));
    // update allRows
    const currentIdArr: string[] = id.split(' ');
    const row = Number.parseInt(currentIdArr[1]);
    const column = Number.parseInt(currentIdArr[3]);
    allRows[row][column].value = value;
    setAllRows(allRows);
  }

  const revertOneChange = (entry: any) => {
    const { id, previousValue, value } = entry;
    console.log('reverting something');
    const currentIdArr: string[] = id.split(' ');
    const row = Number.parseInt(currentIdArr[1]);
    const column = Number.parseInt(currentIdArr[3]);
    allRows[row][column].value = previousValue;
    setAllRows(allRows);
    setLastChangedCell(id);
  }

  console.log('render EditorContainer');
  return (
    <FilteredRowsContext.Provider value={{ columns, allRows: allRows, rows: filteredRows, updateRows, definitions, columnNames }}>
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
              <EditorToolbar allRows={allRows} rows={filteredRows} updateRows={updateRows} columnNames={columnNames} changes={changes} onUndo={revertOneChange} />
            </div>
          </header>
          <div className={classNames("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')}>
            <div className="pf-c-page__sidebar-body">
              <DefinitionsDrawerPanel definitions={definitions} dmnFilePath={dmnFilePath} />
            </div>
          </div>
          <main role="main" className="pf-c-page__main" id="sce-sim-grid__main" tabIndex={-1}>
            <section className="pf-c-page__main-section pf-m-light">
              <Editor allRows={allRows} lastChangedCell={lastChangedCell} columns={columns} rows={filteredRows} definitions={definitions} columnNames={columnNames} onSave={addToChanges} />
            </section>
          </main>
        </div>
      </div>
    </FilteredRowsContext.Provider>
  )
}, (prevProps, nextProps) => {
  // console.log('compare props EditorContainer');
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
