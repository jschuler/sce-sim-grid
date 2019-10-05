import * as React from "react";
import { Title, Expandable, TextContent, Button } from '@patternfly/react-core';
import { Drawer, DrawerContent } from '@patternfly/react-core/dist/js/experimental';
import { BarsIcon } from '@patternfly/react-icons';
import { Editor } from './Editor';
import { DefinitionsDrawerPanel } from './DrawerPanel';
import { getDefinitions, getColumns, getRows, getColumnNames } from "./utils";
import EditorToolbar from './EditorToolbar';
import classNames from 'classnames';

export const FilteredRowsContext = React.createContext<{
  columns: any,
  rows: any[], 
  updateRows?: any, 
  definitions?: any,
  columnNames?: any
}>({
  columns: null,
  rows: [], 
  updateRows: null, 
  definitions: null,
  columnNames: null
});

// const EditorContainer: React.FC<{ data: any, model: any }> = ({ data, model }) => {
const EditorContainer = React.memo<{ data: any, model: any }>(({ data, model }) => {
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);

  const definitions = getDefinitions(model);
  console.log(`definitions:`);
  console.log(definitions);

  const columns = getColumns(data, true, definitions);
  let originalRows = getRows(data);
  for (let i = 0; i < 2000; i++) {
    const clonedArray = JSON.parse(JSON.stringify(originalRows[0]))
    clonedArray[0].value = (i + 6).toString();
    originalRows.push(clonedArray);
  }
  const columnNames = getColumnNames(data);

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

  const filteredText = () => {
    if (originalRows.length === filteredRows.length) {
      // unfiltered
      return `${originalRows.length} rows`;
    } else {
      return `Filtered down to ${filteredRows.length}/${originalRows.length} rows`
    }
  }

  console.log('render EditorContainer');
  return (
    <FilteredRowsContext.Provider value={{ columns, rows: filteredRows, updateRows, definitions, columnNames }}>
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
          </div>
            <div className="pf-c-page__header-tools">
              <EditorToolbar rows={originalRows} />
            </div>
          </header>
          <div className={classNames("pf-c-page__sidebar pf-m-dark", isDrawerExpanded && 'pf-m-expanded', !isDrawerExpanded && 'pf-m-collapsed')}>
            <div className="pf-c-page__sidebar-body">
              <DefinitionsDrawerPanel rows={originalRows} closeDrawer={closeDrawer} />
            </div>
          </div>
          <main role="main" className="pf-c-page__main" id="sce-sim-grid__main" tabIndex={-1}>
            <section className="pf-c-page__main-section pf-m-light">
              <Editor />
            </section>
          </main>
        </div>
        {/* <Drawer isExpanded={isDrawerExpanded} isInline>
          <DrawerContent>
            <div className="pf-u-m-lg">
              <Editor />
            </div>
          </DrawerContent>
          <DefinitionsDrawerPanel rows={originalRows} closeDrawer={closeDrawer} />
        </Drawer> */}
      </div>
    </FilteredRowsContext.Provider>
  )
});

// @ts-ignore
EditorContainer.whyDidYouRender = {
  customName: 'EditorContainer'
};

export { EditorContainer };
