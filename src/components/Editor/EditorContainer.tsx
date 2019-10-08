import * as React from "react";
import { Title, Expandable, TextContent, Button } from '@patternfly/react-core';
import { Drawer, DrawerContent } from '@patternfly/react-core/dist/js/experimental';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from './Editor';
import { DefinitionsDrawerPanel } from './DrawerPanel';
import { getDefinitions, getColumns, getRows, getColumnNames, getDmnFilePath } from "./utils";
import EditorToolbar from './EditorToolbar';
import classNames from 'classnames';

export const FilteredRowsContext = React.createContext<{
  columns: any,
  originalRows: any[],
  rows: any[], 
  updateRows?: any, 
  definitions?: any,
  columnNames?: any
}>({
  columns: null,
  originalRows: [],
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

// const EditorContainer: React.FC<{ data: any, model: any }> = ({ data, model }) => {
const EditorContainer = React.memo<{ data: any, model: any }>(({ data, model }) => {
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);
  const [changes, setChanges] = React.useState<any[]>([]);

  const definitions = getDefinitions(model);
  console.log(`definitions:`);
  console.log(definitions);

  const dmnFilePath = getDmnFilePath(data);

  const columns = getColumns(data, true, definitions);
  let originalRows = getRows(data);
  for (let i = 0; i < 2000; i++) {
    const clonedArray = JSON.parse(JSON.stringify(originalRows[0]))
    clonedArray[0].value = (i + 6).toString();
    originalRows.push(clonedArray);
  }
  const columnNames = getColumnNames(data);

  const [lastChangedCell, setLastChangedCell] = React.useState('');
  const [allRows, setAllRows] = React.useState(originalRows);
  const [filteredRows, updateFilteredRows] = React.useState(originalRows);

  const updateRows = (rows: any[]) => {
    updateFilteredRows(rows);
  }

  const closeDrawer = () => {
    setDrawerExpanded(false);
  };

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
    debugger;
    const currentIdArr: string[] = id.split(' ');
    const row = Number.parseInt(currentIdArr[1]);
    const column = Number.parseInt(currentIdArr[3]);
    allRows[row][column].value = previousValue;
    setAllRows(allRows);
    setLastChangedCell(id);
  }

  console.log('render EditorContainer');
  return (
    <FilteredRowsContext.Provider value={{ columns, originalRows: allRows, rows: filteredRows, updateRows, definitions, columnNames }}>
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
              Kogito scesim editor (Pre-Alpha)
            </div>
          </div>
            <div className="pf-c-page__header-tools">
              <EditorToolbar originalRows={allRows} rows={filteredRows} updateRows={updateRows} columnNames={columnNames} changes={changes} onUndo={revertOneChange} />
            </div>
          </header>
          <div className={classNames("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')}>
            <div className="pf-c-page__sidebar-body">
              <DefinitionsDrawerPanel definitions={definitions} dmnFilePath={dmnFilePath} />
            </div>
          </div>
          <main role="main" className="pf-c-page__main" id="sce-sim-grid__main" tabIndex={-1}>
            <section className="pf-c-page__main-section pf-m-light">
              <Editor originalRows={allRows} lastChangedCell={lastChangedCell} columns={columns} rows={filteredRows} definitions={definitions} columnNames={columnNames} onSave={addToChanges} />
            </section>
          </main>
        </div>
      </div>
    </FilteredRowsContext.Provider>
  )
}, (prevProps, nextProps) => {
  console.log('compare props EditorContainer');
  return true;
});

// @ts-ignore
EditorContainer.whyDidYouRender = {
  customName: 'EditorContainer'
};

export { EditorContainer };
