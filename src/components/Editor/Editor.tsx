import * as React from 'react';
import { EditorRow } from './EditorRow';
import { getColumns, getRows, getColumnNames } from "./utils";
import { useKeyPress } from './useKeyPress';
import classNames from 'classnames';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import "./Editor.css";

const Editor: React.FC<{ data: any, definitions: any, className?: string }> = ({ data, definitions, className }) => {
  const [columnDefs, setColumnDefs] = React.useState<any>({});
  const [columnNames, setColumnNames] = React.useState<any[]>([]);
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [rowDataLength, setRowDataLength] = React.useState<number>(-1);
  const [loading, setLoading] = React.useState(true);
  const [activeInput, setActiveInput] = React.useState<string>('');
  // const [selectedCell, setSelectedCell] = React.useState<string>('');
  const [expandedSelect, setExpandedSelect] = React.useState(false);

  // const inputRefs = React.useRef(null);

  React.useEffect(() => {
    const allColumns = getColumns(data, true, definitions);
    const allRows = getRows(data);
    const allColumnNames = getColumnNames(data);
    console.log(allColumnNames);
    console.log(allColumns);
    console.log(allRows);
    setColumnNames(allColumnNames);
    debugger;
    setColumnDefs(allColumns);
    for (let i = 0; i < 400; i++) {
      allRows.push(allRows[0]);
    }
    setRowData(allRows);
    setRowDataLength(allRows.length);
    setLoading(false);
    setTimeout(() => {
      setNumGivenColumns(allColumns.numGiven);
      setNumExpectColumns(allColumns.numExpect);
    }, 1)
  }, [data, definitions]);

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

  const onCellClick = (event: any, id: string) => {
    console.log(`selected: ${id}`);
    if (id !== activeInput) {
      // get out of previous cell editing mode
      setActiveInput('');
    }
    // setSelectedCell(id);
    focusElement(id);
  };

  const onCellDoubleClick = (event: any, id: string) => {
    console.log(`double click ${id}`);
    onActivateInput(id);
  }

  const onActivateInput = (id: string) => {
    setActiveInput(id);
    focusElement(id);
  }

  const focusElement = (id: string) => {
    setTimeout(() => {
      console.log(`focusing ${id}`);
      document.getElementById(id)!.focus();
    }, 1)
  }

  /**
   * Enter editing mode
   */
  const onEnter = (event: any) => {
    const { id } = event.target;
    console.log(`${id} currently not active, will make active`);
    onActivateInput(id);
  };

  const onEscapeKeyPress = React.useCallback(() => {
    if (expandedSelect) {
      return;
    }
    console.log('exit edit');
    setActiveInput('');
  }, [expandedSelect]);

  const onTabKeyPress = React.useCallback(() => {
    console.log('tabbed');
    setTimeout(() => {
      const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
      onCellClick(null, activeElement);
    }, 1);
  }, []);

  // up
  const onUpKeyPress = React.useCallback(() => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    if (activeInput) {
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
        console.log('up');
        onCellClick(null, targetId);
      }
    }
  }, [expandedSelect]);

  // down
  const onDownKeyPress = React.useCallback(() => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    // if (activeInput) {
    //   return;
    // }
    const currentId = activeElement;
    const maxRow = rowDataLength - 1;
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
        console.log('down');
        onCellClick(null, targetId);
      }
    }
  }, [expandedSelect, rowDataLength]);

  // left
  const onLeftKeyPress = React.useCallback(() => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    // if (activeInput) {
    //   return;
    // }
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
        console.log('left');
        onCellClick(null, targetId);
      }
    }
  }, [expandedSelect]);

  // right
  const onRightKeyPress = React.useCallback(() => {
    const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
    if (expandedSelect) {
      return;
    }
    // if (activeInput) {
    //   return;
    // }
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
        console.log('right');
        onCellClick(null, targetId);
      }
    }
  }, [expandedSelect, columnDefs]);

  useKeyPress('Enter', onEnter, { log: 'editor' });
  useKeyPress('Escape', onEscapeKeyPress, { log: 'editor' });
  useKeyPress('Tab', onTabKeyPress, { log: 'editor' });
  useKeyPress(38, onUpKeyPress, { log: 'editor', deps: [expandedSelect] });
  useKeyPress(40, onDownKeyPress, { log: 'editor', deps: [expandedSelect, rowDataLength] });
  useKeyPress(37, onLeftKeyPress, { log: 'editor', deps: [expandedSelect] });
  useKeyPress(39, onRightKeyPress, { log: 'editor', deps: [expandedSelect, columnDefs] });

  const onSelectToggleCallback = (id: any, isExpanded: boolean) => {
    setExpandedSelect(isExpanded);
  };

  // @ts-ignore
  const Row = ({ index, style }) => (
    <EditorRow
      key={`row ${index}`}
      rowData={rowData} 
      rowIndex={index}
      columnNames={columnNames}
      definitions={definitions}
      onSelectToggleCallback={onSelectToggleCallback}
      activeInput={activeInput}
      onActivateInput={onActivateInput}
      setActiveInput={setActiveInput}
      onCellClick={onCellClick}
      onCellDoubleClick={onCellDoubleClick}
      style={style}
    />
  );

  return loading ? <div>Loading</div> : (
    <div id="kie-grid" className={classNames('kie-grid', className)}>
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

      {rowData.map((row, index) => (
        <EditorRow
          key={`row ${index}`}
          rowData={rowData} 
          rowIndex={index}
          columnNames={columnNames}
          definitions={definitions}
          onSelectToggleCallback={onSelectToggleCallback}
          activeInput={activeInput}
          onActivateInput={onActivateInput}
          setActiveInput={setActiveInput}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          style={{}}
        />
      ))}

          {/* <List
            className="List"
            height={500}
            itemCount={rowData.length}
            itemSize={82}
            width={'100%'}
          >
            {Row}
          </List> */}

      {/* <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            itemCount={rowData.length}
            itemSize={26}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer> */}
    </div>
  );
};

export { Editor };
