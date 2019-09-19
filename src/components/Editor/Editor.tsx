import * as React from "react";
import { getColumns, getRows, getColumnNames } from "./utils";
import { Input } from './Input';
import { useKeyPress } from './useKeyPress';
import classNames from 'classnames';
import "./Editor.css";

const Editor: React.FC<{ data: any, definitions: any, className?: string }> = ({ data, definitions, className }) => {
  const [columnDefs, setColumnDefs] = React.useState<any>({});
  const [columnNames, setColumnNames] = React.useState<any[]>([]);
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeInput, setActiveInput] = React.useState<string>('');
  const [selectedCell, setSelectedCell] = React.useState<string>('');

  // const inputRefs = React.useRef(null);

  React.useEffect(() => {
    const allColumns = getColumns(data, true, definitions);
    const allRows = getRows(data);
    const allColumnNames = getColumnNames(data);
    console.log(allColumnNames);
    console.log(allColumns);
    console.log(allRows);
    setColumnNames(allColumnNames);
    setColumnDefs(allColumns);
    setRowData(allRows);
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
    setSelectedCell(id);
    focusElement(id);
  };

  const onCellDoubleClick = (event: any, id: string) => {
    onActivateInput(id);
  }

  const onActivateInput = (id: string) => {
    setActiveInput(id);
    focusElement(id);
  }

  const focusElement = (id: string) => {
    setTimeout(() => {
      document.getElementById(id)!.focus();
    }, 1)
  }

  useKeyPress('Escape', () => {
    console.log('exit edit');
    setActiveInput('');
  });

  useKeyPress('Tab', () => {
    console.log('tabbed');
    setTimeout(() => {
      const activeElement = (document && document.activeElement && document.activeElement.getAttribute('id')) || '';
      onCellClick(null, activeElement);
    }, 1);
  });

  // up
  useKeyPress(38, () => {
    if (activeInput) {
      return;
    }
    const currentId = selectedCell;
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
  });

  // down
  useKeyPress(40, () => {
    if (activeInput) {
      return;
    }
    const currentId = selectedCell;
    const maxRow = rowData.length - 1;
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
  });

  // left
  useKeyPress(37, () => {
    if (activeInput) {
      return;
    }
    const currentId = selectedCell;
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
  });

  // right
  useKeyPress(39, () => {
    if (activeInput) {
      return;
    }
    const currentId = selectedCell;
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
  });

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

      {rowData.map((row, index) => {
        const rowIndex = index;
        return (
          <div className="kie-grid__rule" key={`row ${rowIndex}`}>
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
              return (
                <div className="kie-grid__item" key={inputId} onClick={(event) => onCellClick(event, inputId)} onDoubleClick={(event) => onCellDoubleClick(event, inputId)}>
                  {cellIndex === 0 ? <>{value}</> : 
                    <Input isReadOnly={inputId !== activeInput} onActivateInput={onActivateInput} setActiveInput={setActiveInput} originalValue={value} path={path} type={type} id={inputId} />}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  );
};

export { Editor };
