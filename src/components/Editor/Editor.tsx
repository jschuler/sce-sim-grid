import * as React from "react";
import { getColumns, getRows, getDefinitions } from "./utils";
import { Input } from './Input';
import "@patternfly/patternfly/patternfly.min.css";
import "./Editor.css";

const Editor: React.FC<{ data: any, model: any }> = ({ data, model }) => {
  const [columnDefs, setColumnDefs] = React.useState<any>({});
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [types, setTypes] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);

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
              return (
                <div className="kie-grid__item" key={`cell ${cellIndex}`}>
                  {cellIndex === 0 ? <>{value}</> : 
                    <Input originalValue={value} path={path} type={type} id={`row ${rowIndex} cell ${cellIndex}`} />}
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
