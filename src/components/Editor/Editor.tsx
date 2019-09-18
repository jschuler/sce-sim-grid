import * as React from "react";
import { getColumns, getRows, getDefinitions } from "./utils";
import { Input } from './Input';
import { useKeyPress } from './useKeyPress';
import "@patternfly/patternfly/patternfly.min.css";
import "./Editor.css";

const Editor: React.FC<{ data: any, model: any }> = ({ data, model }) => {
  const [columnDefs, setColumnDefs] = React.useState<any>({});
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [types, setTypes] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);
  const [activeInput, setActiveInput] = React.useState<string>('');
  const [selectedCell, setSelectedCell] = React.useState<string>('');

  // const inputRefs = React.useRef(null);

  React.useEffect(() => {
    const allDefinitions = getDefinitions(model);
    const allColumns = getColumns(data, true, allDefinitions);
    const allRows = getRows(data);
    console.log(`allColumns:`);
    console.log(allColumns);
    console.log(`allRows:`);
    console.log(allRows);
    console.log(`allDefinitions:`);
    console.log(allDefinitions);
    setColumnDefs(allColumns);
    setRowData(allRows);
    setTypes(allDefinitions);
    setLoading(false);
    setTimeout(() => {
      setNumGivenColumns(allColumns.numGiven);
      setNumExpectColumns(allColumns.numExpect);
    }, 1)
  }, [data, model]);

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
    console.log(`selected: ${id}`)
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

  // up
  useKeyPress(38, () => {
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
    <div id="kie-grid" className="kie-grid">
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
              // get the type of the column to pass on to the input for validation
              let type = 'any';
              const allColumns = getColumns(data, false, types);
              // index 0 is not an input
              // index 1 is the description and always string
              if (index === 1) {
                type = 'string';
              } else if (index > 1) {
                if (index < allColumns.numGiven + 2) {
                  type = allColumns.given[index - 2].type;
                } else {
                  type = allColumns.expect[index - 2 - allColumns.numGiven].type;
                }
              }
              const cellIndex = index;
              const value = cell && cell.value ? cell.value : '';
              const path = cell && cell.path ? cell.path : '';
              // const cellId = `cell ${cellIndex}`;
              const inputId = `row ${rowIndex} column ${cellIndex}`;
              return (
                <div className="kie-grid__item" key={inputId} onClick={(event) => onCellClick(event, inputId)} onDoubleClick={(event) => onCellDoubleClick(event, inputId)}>
                  {cellIndex === 0 ? <>{value}</> : 
                    <Input isReadOnly={inputId !== activeInput} onActivateInput={onActivateInput} originalValue={value} path={path} type={type} id={inputId} />}
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
