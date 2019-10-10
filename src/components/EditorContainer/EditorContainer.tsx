import * as React from "react";
import { Button } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from '../Editor';
import { DefinitionsDrawerPanel } from '../Sidebar';
import { getDefinitions, getColumns, getRows, getColumnNames, getDmnFilePath } from "./scesimUtils";
import { EditorToolbar } from '../Toolbar';
import classNames from 'classnames';

export const TrackChangesContext = React.createContext<{
  changes: any[]
}>({
  changes: []
});

const EditorContainer = React.memo<{ data: any, model: any }>(({ data, model }) => {
  // console.log('render EditorContainer');

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
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);
  const [changes, setChanges] = React.useState<any[]>([]);
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
    }
  }, [data, model]);

  /**
   * Toggle the sidebar
   */
  const toggleDrawer = () => {
    setDrawerExpanded(!isDrawerExpanded);
  }

  /**
   * Callback function for EditorToolbar, called on filter change
   */
  const updateRows = (rows: any) => {
    setFilteredRows(rows);
  }

  /** 
   * Callback function for Editor inputs. When they're saved we add it to the list of changes for change-tracking.
   */
  const addToChanges = (id: string, value: string, previousValue: string) => {
    setChanges((prevState: any) => ([...prevState, { id, value, previousValue }]));
    // update allRows
    // const currentIdArr: string[] = id.split(' ');
    // const row = Number.parseInt(currentIdArr[1]);
    // const column = Number.parseInt(currentIdArr[3]);
    // allRows[row][column].value = value;
    // setAllRows(allRows);
  }

  /**
   * Reverts the last Input change
   */
  const revertOneChange = (entry: any) => {
    // const { id, previousValue, value } = entry;
    // const currentIdArr: string[] = id.split(' ');
    // const row = Number.parseInt(currentIdArr[1]);
    // const column = Number.parseInt(currentIdArr[3]);
    // allRows[row][column].value = previousValue;
    // setAllRows(allRows);
    // setLastChangedCell(id);
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
              rows={filteredRows} 
              updateRows={updateRows} 
              columnNames={columnNames} 
              changes={changes} 
              onUndo={revertOneChange} 
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
              rows={filteredRows} 
              definitions={definitions} 
              columnNames={columnNames} 
              onSave={addToChanges} 
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
