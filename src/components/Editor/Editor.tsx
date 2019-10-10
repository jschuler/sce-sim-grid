import * as React from 'react';
import { setCaretPositionAtEnd, focusCell } from "./utils";
import { useKeyPress } from './useKeyPress';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from '../Spinner';
import { Input } from './Input';
import { Select } from './Select';
import "./Editor.css";

const Editor = React.memo<{ 
  columns: any, 
  rows : any, 
  definitions: any, 
  columnNames: any,
  onSave: any
}>(({ 
  columns: columnDefs, 
  rows, 
  definitions, 
  columnNames,
  onSave
}) => {
  // console.log('render Editor');

  const rowsToFetch = 50;

  const [editableCell, setEditable] = React.useState<string>('');
  const [expandedSelect, setExpandedSelect] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [fetchedRows, setFetchedRows] = React.useState(rows.slice(0, rowsToFetch));

  const editorRef = React.useRef(null);

  React.useEffect(() => {
    setTimeout(() => {
      setNumGivenColumns(columnDefs.numGiven);
      setNumExpectColumns(columnDefs.numExpect);
    }, 1)
  }, [columnDefs]);

  React.useEffect(() => {
    if (JSON.stringify(fetchedRows) !== JSON.stringify(rows.slice(0, rowsToFetch))) {
      setFetchedRows(rows.slice(0, rowsToFetch));
    }
  }, [rows]);

  const setNumGivenColumns = (num: number) => {
    document
      .getElementById("kie-grid")!
      .style.setProperty("--num-given-columns", num.toString());
  };

  const setNumExpectColumns = (num: number) => {
    document
      .getElementById("kie-grid")!
      .style.setProperty("--num-expect-columns", num.toString());
  };

  const activateCell = (id: string) => {
    if (id) {
      setEditable(id);
    }
  }

  const deactivateCell = () => {
    setEditable('');
  }

  const activateAndFocusCell = (id: string) => {
    activateCell(id);
    focusCell(id);
  }

  const deactivateAndFocusCell = (id: string) => {
    deactivateCell();
    focusCell(id);
  }

  const onCellClick = (event: any) => {
    const { id } = event.target;
    if (id === editableCell) {
      // already active
      return null;
    }
    if (editableCell) {
      // get out of a previous cell editing mode
      deactivateCell();
    }
    return id;
  };

  /**
   * Enter editing mode
   */
  const onCellDoubleClick = (event: any) => {
    const id = onCellClick(event);
    if (id) {
      activateAndFocusCell(id);
    }
  }

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
  const onUpKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    if (editableCell) {
      return;
    }
    const currentId = activeElement;
    const minRow = 0;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentRow = Number.parseInt(currentIdArr[1]);
      // going up means decrementing the row
      const newRow = currentRow - 1;
      if (newRow < minRow) {
        return;
      } else {
        targetId = `row ${newRow} column ${currentIdArr[3]}`;
        focusCell(targetId);
      }
    }
  };

  /**
   * Down arrow key
   */
  const onDownKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    if (editableCell) {
      return;
    }
    const currentId = activeElement;
    const maxRow = rows.length - 1;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentRow = Number.parseInt(currentIdArr[1]);
      // going down means incrementing the row
      const newRow = currentRow + 1;
      if (newRow > maxRow) {
        return;
      } else {
        targetId = `row ${newRow} column ${currentIdArr[3]}`;
        focusCell(targetId);
      }
    }
  };

  /**
   * Left arrow key
   */
  const onLeftKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    if (editableCell) {
      return;
    }
    const currentId = activeElement;
    const minCol = 1;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentCol = Number.parseInt(currentIdArr[3]);
      // going left means decrementing the column
      const newCol = currentCol - 1;
      if (newCol < minCol) {
        return;
      } else {
        targetId = `row ${currentIdArr[1]} column ${newCol}`;
        focusCell(targetId);
      }
    }
  };

  /**
   * Right arrow key
   */
  const onRightKeyPress = (event: any) => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    if (editableCell) {
      return;
    }
    const currentId = activeElement;
    const maxCol = columnDefs.numGiven + columnDefs.numExpect + 1;
    let targetId;
    if (currentId) {
      // ['row', '1', 'column', '2']
      const currentIdArr: string[] = currentId.split(' ');
      const currentCol = Number.parseInt(currentIdArr[3]);
      // going right means incrementing the column
      const newCol = currentCol + 1;
      if (newCol > maxCol) {
        return;
      } else {
        targetId = `row ${currentIdArr[1]} column ${newCol}`;
        focusCell(targetId);
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

  // Command / CTRL + C copies the focused cell content
  useKeyPress(/c/i, onCopy, { log: 'editor', withModifier: true });
  useKeyPress('Enter', onEnter, { log: 'editor', isActive: !editableCell });
  useKeyPress(38, onUpKeyPress, { log: 'editor' });
  useKeyPress(40, onDownKeyPress, { log: 'editor' });
  useKeyPress(37, onLeftKeyPress, { log: 'editor' });
  useKeyPress(39, onRightKeyPress, { log: 'editor' });

  const onSelectToggleCallback = (id: any, isExpanded: boolean) => {
    setExpandedSelect(isExpanded);
  };

  // rowData
  const fetchMoreRows = (page?: number) => {
    if (page) {
      // fetchedRows = rowData.slice(0, page * rowsToFetch + rowsToFetch);
      setFetchedRows((prevState: any) => ([...prevState, ...rows.slice(page * rowsToFetch, page * rowsToFetch + rowsToFetch)]));
    } else {
      setFetchedRows((prevState: any) => ([...prevState, ...rows.slice(currentPage * rowsToFetch, currentPage * rowsToFetch + rowsToFetch)]));
      // fetchedRows = rowData.slice(0, currentPage * rowsToFetch + rowsToFetch);
      setCurrentPage(currentPage + 1);
    }
  };

  return !fetchedRows ? null : (
    <>
      <div id="kie-grid" className="kie-grid" ref={editorRef}>
        {columnDefs.other.map((other: { name: string }, index: number) => {
          if (index === 0) {
            return <div className="kie-grid__item kie-grid__number" key="other-number">{other.name}</div>
          } else {
            return (
              <div className="kie-grid__item kie-grid__description" key="other-description">{other.name}</div>
            )
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
          {columnDefs.given.map((given: any, index: number) => {
            return given.children.map((givenChild: any, index: number) => (
              <div key={`given property ${index}`} className="kie-grid__item kie-grid__property">{givenChild.name}</div>
            ));
          })}
        </div>
        <div className="kie-grid__header--expect">
          {columnDefs.expect.map((expect: any, index: number) => {
            return expect.children.map((expectChild: any, index: number) => (
              <div key={`expect property ${index}`} className="kie-grid__item kie-grid__property">{expectChild.name}</div>
            ));
          })}
        </div>

        <div className="kie-grid__body">
          <InfiniteScroll
            dataLength={fetchedRows.length}
            next={fetchMoreRows}
            hasMore={fetchedRows.length < rows.length}
            loader={<Spinner className="kie-grid__item kie-grid__item--loading pf-u-pt-sm" size="md" />}
            scrollableTarget="sce-sim-grid__main"
          >
              {fetchedRows.map((row: any, rowIndex: number) => (
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
                      type = (definitions.map[columnNames[index].group] && definitions.map[columnGroup][columnName]) || 'string';
                    }
                    const cellIndex = index;
                    const value = cell && cell.value ? cell.value : '';
                    const path = cell && cell.path ? cell.path : '';
                    // const cellId = `cell ${cellIndex}`;
                    const inputId = `row ${rowIndex} column ${cellIndex}`;
                    let component;
                    const typeArr = type.split(',');
                    if (typeArr.length > 1) {
                      // Multiple options, render Select
                      component = (
                        <Select 
                          isReadOnly={inputId !== editableCell} 
                          id={inputId} 
                          originalValue={value}                          
                          onSelectToggleCallback={onSelectToggleCallback} 
                          options={typeArr.map(string => string.trim())} 
                          deactivateAndFocusCell={deactivateAndFocusCell}
                          setEditable={setEditable}
                          onSave={onSave}
                        />
                      );
                    } else {
                      component = (
                        <Input
                          isReadOnly={inputId !== editableCell} 
                          id={inputId} 
                          originalValue={value} 
                          path={path} 
                          type={type} 
                          deactivateAndFocusCell={deactivateAndFocusCell}
                          setEditable={setEditable}
                          onSave={onSave}
                        />
                      );
                    }
                    return (
                      <div className="kie-grid__item" key={inputId} onClick={onCellClick} onDoubleClick={onCellDoubleClick}>
                        {cellIndex === 0 ? value : component}
                      </div>
                    )
                  })}
                </div>
              ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.rows.length !== nextProps.rows.length || JSON.stringify(prevProps.rows) !== JSON.stringify(nextProps.rows)) {
    // rows have changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
Editor.whyDidYouRender = {
  customName: 'Editor'
};

export { Editor };
