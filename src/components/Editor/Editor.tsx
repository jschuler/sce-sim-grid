import * as React from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames';
import { Input, Select } from '../Cell';
// import { Spinner } from '../Spinner';
import { Action } from '../Cell';
import { focusCell, setCaretPositionAtEnd, useKeyPress } from '../utils';
import './Editor.css';
import { Empty } from './Empty';
import { Pagination, Button } from '@patternfly/react-core';
import { PficonSortCommonAscIcon, PficonSortCommonDescIcon, ArrowsAltVIcon } from '@patternfly/react-icons';

const Editor: React.FC<{ 
  columns: any,
  rows: any[],
  filterRows: any,
  searchValue: string,
  searchSelections: any[],
  filteredRows: any,
  definitions: any,
  columnNames: any,
  onSave: any,
  lastForcedUpdate: string,
  readOnly: boolean,
  mergeCells?: boolean,
  onClearFilters: any,
  computeCellMerges: any,
  onSort: any,
  insertRowAt: any,
  page: number,
  perPage: number,
  fetchPage: any
}> = ({ 
  columns: columnDefs,
  rows,
  filterRows,
  searchValue,
  searchSelections,
  filteredRows,
  definitions,
  columnNames,
  onSave,
  lastForcedUpdate,
  readOnly,
  mergeCells = false,
  onClearFilters,
  computeCellMerges,
  onSort,
  insertRowAt,
  page,
  perPage,
  fetchPage
}) => {
  // console.log('render Editor');

  const [state, setState] = React.useState({
    editableCell: '',
    expandedSelect: false,
    currentPage: 1,
    sortBy: 0,
    sortDirection: 'asc'
  });

  const editorRef = React.useRef(null);

  React.useEffect(() => {
    setTimeout(() => {
      setNumGivenColumns(columnDefs.numGiven);
      setNumExpectColumns(columnDefs.numExpect);
    }, 1);
  }, [columnDefs]);

  const setNumGivenColumns = (num: number) => {
    document
      .getElementById('kie-grid')!
      .style.setProperty('--num-given-columns', num.toString());
  };

  const setNumExpectColumns = (num: number) => {
    document
      .getElementById('kie-grid')!
      .style.setProperty('--num-expect-columns', num.toString());
  };

  const activateCell = (id: string) => {
    if (id) {
      setState(prevState => ({
        ...prevState,
        editableCell: id
      }));
    }
  };

  const deactivateCell = () => {
    setState(prevState => ({
      ...prevState,
      editableCell: ''
    }));
  };

  const activateAndFocusCell = (id: string) => {
    activateCell(id);
    focusCell(id);
  };

  const deactivateAndFocusCell = (id: string) => {
    deactivateCell(); // expensive, causes re-renders?
    focusCell(id);
  };

  const onCellClick = (event: any) => {
    const { id } = event.target;
    if (id === state.editableCell) {
      // already active
      return null;
    }
    if (state.editableCell) {
      // get out of a previous cell editing mode
      deactivateCell();
    }
    return id;
  };

  /**
   * Enter editing mode
   */
  const onCellDoubleClick = (event: any) => {
    if (readOnly) {
      return;
    }
    const id = onCellClick(event);
    if (id) {
      activateAndFocusCell(id);
    }
  };

  /**
   * Enter editing mode
   */
  const onEnter = (event: any) => {
    // don't want Input's onEnter listener to fire
    event.stopPropagation();
    onCellDoubleClick(event);
  };

  /**
   * Up arrow key
   */
  const onUpKeyPress = (event: any, previousId?: string) => {
    const activeElement = previousId || (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (state.expandedSelect) {
      return;
    }
    if (state.editableCell) {
      return;
    }
    const currentId = activeElement;
    const minRow = 0;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentRow = Number.parseInt(currentIdArr[1], 10);
      // going up means decrementing the row
      const newRow = currentRow - 1;
      if (newRow < minRow) {
        return;
      } else {
        targetId = `row ${newRow} column ${currentIdArr[3]}`;
        if (document.getElementById(targetId) && document.getElementById(targetId)!.offsetHeight) {
          // checking offsetHeight is a trick to know if the element is visible
          focusCell(targetId);
        } else {
          // recurse
          onUpKeyPress(event, targetId);
        }
      }
    }
  };

  /**
   * Down arrow key
   */
  const onDownKeyPress = (event: any, previousId?: string) => {
    const activeElement = previousId || (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (state.expandedSelect) {
      return;
    }
    if (state.editableCell) {
      return;
    }
    const currentId = activeElement;
    const maxRow = rows.length - 1; // filteredRows
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentRow = Number.parseInt(currentIdArr[1], 10);
      // going down means incrementing the row
      const newRow = currentRow + 1;
      if (newRow > maxRow) {
        return;
      } else {
        targetId = `row ${newRow} column ${currentIdArr[3]}`;
        if (document.getElementById(targetId) && document.getElementById(targetId)!.offsetHeight) {
          // checking offsetHeight is a trick to know if the element is visible
          focusCell(targetId);
        } else {
          // recurse
          onDownKeyPress(event, targetId);
        }
      }
    }
  };

  /**
   * Left arrow key
   */
  const onLeftKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (state.expandedSelect) {
      return;
    }
    if (state.editableCell) {
      return;
    }
    const currentId = activeElement;
    const minCol = 1;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentCol = Number.parseInt(currentIdArr[3], 10);
      // going left means decrementing the column
      const newCol = currentCol - 1;
      if (newCol < minCol) {
        return;
      } else {
        targetId = `row ${currentIdArr[1]} column ${newCol}`;
        if (document.getElementById(targetId) && document.getElementById(targetId)!.offsetHeight) {
          // checking offsetHeight is a trick to know if the element is visible
          focusCell(targetId);
        } else {
          // the element may be hidden due to cell merging. recurse up to find the master cell
          onUpKeyPress(event, targetId);
        }
      }
    }
  };

  /**
   * Right arrow key
   */
  const onRightKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (state.expandedSelect) {
      return;
    }
    if (state.editableCell) {
      return;
    }
    const currentId = activeElement;
    const maxCol = columnDefs.numGiven + columnDefs.numExpect + 1;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentCol = Number.parseInt(currentIdArr[3], 10);
      // going right means incrementing the column
      const newCol = currentCol + 1;
      if (newCol > maxCol) {
        return;
      } else {
        targetId = `row ${currentIdArr[1]} column ${newCol}`;
        if (document.getElementById(targetId) && document.getElementById(targetId)!.offsetHeight) {
          // checking offsetHeight is a trick to know if the element is visible
          focusCell(targetId);
        } else {
          // the element may be hidden due to cell merging. recurse up to find the master cell
          onUpKeyPress(event, targetId);
        }
      }
    }
  };

  /**
   * Copy cell listener
   */
  const onCopy = (event: any) => {
    /* Get the text field */
    const copyText = event.target;
    if (copyText && copyText.select) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      /* Copy the text inside the text field */
      document.execCommand('copy');
      // do not mark the whole text as selected
      setCaretPositionAtEnd(copyText);
    }
  };

  // Command + C / CTRL + C copies the focused cell content
  useKeyPress(/c/i, onCopy, { log: 'editor', withModifier: true });
  useKeyPress('Enter', onEnter, { log: 'editor', isActive: (!state.editableCell && !readOnly) });
  useKeyPress(38, onUpKeyPress, { log: 'editor' });
  useKeyPress(40, onDownKeyPress, { log: 'editor' });
  useKeyPress(37, onLeftKeyPress, { log: 'editor' });
  useKeyPress(39, onRightKeyPress, { log: 'editor' });

  const onSelectToggleCallback = (id: any, isExpanded: boolean) => {
    setState(prevState => ({
      ...prevState,
      expandedSelect: isExpanded
    }));
  };

  const setEditable = (id: string) => {
    setState(prevState => ({
      ...prevState,
      editableCell: id
    }));
  };

  const onSortEditor = (columnIndex: number) => {
    let sortDirection: string = 'asc';
    if (state.sortBy === columnIndex) {
      // switch sort direction
      sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      setState(prevState => ({
        ...prevState,
        sortDirection
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        sortBy: columnIndex,
        sortDirection: 'asc'
      }));
    }
    onSort(columnIndex, sortDirection);
  };

  const onInsertRowAbove = (rowIndex: number) => {
    console.log('above');
    insertRowAt(rowIndex);
  }

  const onInsertRowBelow = (rowIndex: number) => {
    console.log('below');
    insertRowAt(rowIndex + 1);
  }

  // const fetchMoreRows = () => {
  //   setState(prevState => ({
  //     ...prevState,
  //     page: prevState.page + 1
  //   }));
  // };

  let columnIndex = 1;
  return !rows ? null : (
    <>
      {rows.length > 20 && <Pagination
        className="pf-u-pb-md"
        itemCount={filterRows(rows).length}/* required: Total number of items. */
        variant={'top'}/* optional: Position where pagination is rendered. */
        isCompact={false}/* optional: Flag indicating if pagination is compact */
        perPage={perPage}/* optional: Number of items per page. */
        page={page}/* optional: Current page number. */
        onSetPage={(_evt, value) => fetchPage(value, perPage)}
        onPerPageSelect={(_evt, value) => fetchPage(1, value)}
        perPageOptions={[
          {
            title: '10',
            value: 10
          },
          {
            title: '20',
            value: 20
          },
          {
            title: '50',
            value: 50
          }
        ]}
      />}
      <div id="kie-grid" className="kie-grid" ref={editorRef}>
        {columnDefs.other.map((other: { name: string }, index: number) => {
          if (index === 0) {
            return (
              <Button variant="plain" className="kie-grid__item kie-grid__number" key="other-number" onClick={() => onSortEditor(0)}>
                <div className={state.sortBy === 0 ? 'active': ''}>{other.name}</div>
                <div>
                  {state.sortBy === 0 && (state.sortDirection === 'asc' ? <PficonSortCommonAscIcon className="sort-icon active" size="sm" /> : <PficonSortCommonDescIcon className="sort-icon active" size="sm" />)}
                  {state.sortBy !== 0 && <ArrowsAltVIcon className="sort-icon" size="sm" />}
                </div>
              </Button>
            );
          } else {
            return (
              <Button variant="plain" className="kie-grid__item kie-grid__description" key="other-description" onClick={() => onSortEditor(1)}>
                <div className={state.sortBy === 1 ? 'active': ''}>{other.name}</div>
                <div>
                  {state.sortBy === 1 && (state.sortDirection === 'asc' ? <PficonSortCommonAscIcon className="sort-icon active" size="sm" /> : <PficonSortCommonDescIcon className="sort-icon active" size="sm" />)}
                  {state.sortBy !== 1 && <ArrowsAltVIcon className="sort-icon" size="sm" />}
                </div>
              </Button>
            );
          }
        })}
        {/* The GIVEN and EXPECT groups are always there so this can be hardcoded */}
        <div className="kie-grid__header--given">
          <div className="kie-grid__item kie-grid__given">GIVEN</div>
        </div>
        <div className="kie-grid__header--expect">
          <div className="kie-grid__item kie-grid__expect">EXPECT</div>
        </div>

        {/* <!-- grid instance headers need to have a grid-column span set --> */}
        <div className="kie-grid__header--given">
          {columnDefs.given.map((given: any, index: number) => (
            <div
              key={`given instance ${index}`}
              className="kie-grid__item kie-grid__instance"
              style={{ gridColumn: `span ${given.children.length}` }}
            >
              {given.group}
            </div>
          ))}
        </div>

        <div className="kie-grid__header--expect">
          {columnDefs.expect.map((expect: any, index: number) => (
            <div
              key={`expect instance ${index}`}
              className="kie-grid__item kie-grid__instance"
              style={{ gridColumn: `span ${expect.children.length}` }}
            >
              {expect.group}
            </div>
          ))}
        </div>

        <div className="kie-grid__header--given">
          {columnDefs.given.map((given: any) => {
            return given.children.map((givenChild: any, index: number) => {
              columnIndex += 1;
              const sortByColumnIndex = columnIndex;
              return (
              <Button variant="plain" className="kie-grid__item kie-grid__property" key={`given property ${index}`} onClick={() => onSortEditor(sortByColumnIndex)}>
                <div className={state.sortBy === sortByColumnIndex ? 'active': ''}>{givenChild.name}</div>
                <div>
                  {state.sortBy === sortByColumnIndex && (state.sortDirection === 'asc' ? <PficonSortCommonAscIcon className="sort-icon active" size="sm" /> : <PficonSortCommonDescIcon className="sort-icon active" size="sm" />)}
                  {state.sortBy !== sortByColumnIndex && <ArrowsAltVIcon className="sort-icon" size="sm" />}
                </div>
              </Button>
            )});
          })}
        </div>
        <div className="kie-grid__header--expect">
          {columnDefs.expect.map((expect: any) => {
            return expect.children.map((expectChild: any, index: number) => {
              columnIndex += 1;
              const sortByColumnIndex = columnIndex;
              return (
              <Button variant="plain" className="kie-grid__item kie-grid__property" key={`expect property ${index}`} onClick={() => onSortEditor(sortByColumnIndex)}>
                <div className={state.sortBy === sortByColumnIndex ? 'active': ''}>{expectChild.name}</div>
                <div>
                  {state.sortBy === sortByColumnIndex && (state.sortDirection === 'asc' ? <PficonSortCommonAscIcon className="sort-icon active" size="sm" /> : <PficonSortCommonDescIcon className="sort-icon active" size="sm" />)}
                  {state.sortBy !== sortByColumnIndex && <ArrowsAltVIcon className="sort-icon" size="sm" />}
                </div>
              </Button>
            )});
          })}
        </div>

        <div className="kie-grid__item kie-grid__action" key="action-column">Action</div>

        <div className={classNames('kie-grid__body', mergeCells && 'kie-grid--merged')}>
          {(searchValue || searchSelections.length > 0) && filterRows(rows).length === 0 ? (
            <Empty className="kie-grid__item--empty" onClear={onClearFilters} />
          ) : (
            // <InfiniteScroll
            //   dataLength={filterRows(rows).slice(0, state.page * 5).length}
            //   next={fetchMoreRows}
            //   hasMore={filterRows(rows).slice(0, state.page * 5).length < rows.length} // filteredRows
            //   loader={<Spinner className="kie-grid__item kie-grid__item--loading pf-u-pt-sm" size="md" />}
            //   scrollableTarget="sce-sim-grid__main"
            // >
              <div>
                {
                  computeCellMerges(filterRows(rows).slice(((page - 1) * perPage), page * perPage)).map((row: any) => (
                    <div className="kie-grid__rule" style={{}} key={`row ${row[0].value}`}>
                      {row.map((cell: any, index: number) => {
                        // get the type of the column to pass on to the input for formatting / validation
                        let type = 'string';
                        let columnGroup = '';
                        let columnName = '';
                        if (index === 0) {
                          // row index
                          type = 'number';
                        } else if (index === 1) {
                          // description
                          type = 'string';
                        } else if (index > 1) {
                          columnGroup = columnNames[index].group;
                          columnName = columnNames[index].name;
                          type = (definitions && definitions.map[columnNames[index].group] && definitions.map[columnGroup][columnName]) || 'string';
                        }
                        const cellIndex = index;
                        const value = cell && cell.value ? cell.value : '';
                        const path = cell && cell.path ? cell.path : '';
                        // const cellId = `cell ${cellIndex}`;
                        const inputId = `row ${Number.parseInt(row[0].value, 10) - 1} column ${cellIndex}`;
                        let component;
                        const typeArr = type.split(',');
                        if (typeArr.length > 1) {
                          // Multiple options, render Select
                          component = (
                            <Select
                              isReadOnly={inputId !== state.editableCell}
                              cellId={inputId}
                              rowId={row[0].value}
                              originalValue={value}
                              onSelectToggleCallback={onSelectToggleCallback}
                              options={typeArr.map((typeString) => typeString.trim())}
                              deactivateAndFocusCell={deactivateAndFocusCell}
                              setEditable={setEditable}
                              onSave={onSave}
                            />
                          );
                        } else {
                          component = (
                            <Input
                              isReadOnly={inputId !== state.editableCell}
                              cellId={inputId}
                              rowId={row[0].value}
                              originalValue={value}
                              path={path}
                              type={type}
                              deactivateAndFocusCell={deactivateAndFocusCell}
                              setEditable={setEditable}
                              onSave={onSave}
                            />
                          );
                        }
                        const mergeRowsStyle = {
                          gridRow: `span ${cell.coverCells || 1}`
                        };
                        return (
                          <div 
                            className={classNames('kie-grid__item', cell.master && 'kie-grid__item--merge-master', cell.follower && 'kie-grid__item--merge-away')} 
                            style={mergeCells ? mergeRowsStyle : {}}
                            key={inputId} 
                            onClick={onCellClick} 
                            onDoubleClick={onCellDoubleClick}
                          >
                            {cellIndex === 0 ? value : component}
                          </div>
                        );
                      })}
                      <div 
                        className="kie-grid__item"
                      >
                        <Action 
                          rowIndex={Number.parseInt(row[0].value) - 1}
                          onInsertRowAbove={onInsertRowAbove}
                          onInsertRowBelow={onInsertRowBelow}
                        />
                      </div>
                    </div>
                  ))
                  }
              </div>
            //</InfiniteScroll>
          )}
        </div>
      </div>
      {rows.length > 20 && <Pagination
        className="pf-u-pt-md"
        itemCount={filterRows(rows).length}/* required: Total number of items. */
        variant={'bottom'}/* optional: Position where pagination is rendered. */
        isCompact={false}/* optional: Flag indicating if pagination is compact */
        perPage={perPage}/* optional: Number of items per page. */
        page={page}/* optional: Current page number. */
        onSetPage={(_evt, value) => fetchPage(value, perPage)}
        onPerPageSelect={(_evt, value) => fetchPage(1, value)}
        perPageOptions={[
          {
            title: '10',
            value: 10
          },
          {
            title: '20',
            value: 20
          },
          {
            title: '50',
            value: 50
          }
        ]}
      />}
    </>
  );
};

// @ts-ignore
Editor.whyDidYouRender = {
  customName: 'Editor',
};

export { Editor };
