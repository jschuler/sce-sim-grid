import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "./AgGrid.css";
import NumericEditor from "./numericEditor";
import { getColumns, getRows, getColumnNames } from "../Editor/utils";

const AgGrid: React.FC<{ data: any }> = ({ data }) => {
  const [frameworkComponents, setFrameworkComponents] = useState({
    numericEditor: NumericEditor
  });
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState({});
  const [columnApi, setColumnApi] = useState({});

  useEffect(() => {
    updateColumnDefs(data);
    updateRowDefs(data);
  }, []);

  const updateColumnDefs = (data: any) => {
    let gridColumns = [] as any[];
    const dataColumns = getColumns(data);

    // OTHER
    dataColumns.other.forEach(col => {
      gridColumns.push({
        headerName: col.name,
        field: col.name,
        headerClass: 'description-header-cell'
      })
    });

    // GIVEN
    gridColumns.push(parseGroup('GIVEN', dataColumns.given, 'given-header-cell'));

    // EXPECT
    gridColumns.push(parseGroup('EXPECT', dataColumns.expect, 'expect-header-cell'));

    setColumnDefs(gridColumns);
  };

  const updateRowDefs = (data: any) => {
    let gridRows = [] as any[];
    const dataRows = getRows(data);
    const columnNames = getColumnNames(data);
    
    dataRows.forEach((row, index) => {
      let dataNode: any = {};
      if (row.length !== columnNames.length) {
        console.log('column length does not match');
        return;
      }
      row.forEach((item: any, index: number) => {
        dataNode[columnNames[index]] = item;
      })
      gridRows.push(dataNode);
    });
    
    setRowData(gridRows);
  };

  const parseGroup = (groupName: string, dataColumns: any[], headerClass?: string) => {
    let group: any = {
      headerName: groupName,
      children: [],
      headerClass,
    };
    let previousGroup: string;
    dataColumns.forEach((col, index) => {
      if (index === 0) {
        previousGroup = col.group;
        group.children.push({
          headerName: col.group,
          headerClass,
          children: [
            {
              headerName: col.name,
              field: col.name,
              headerClass
            }
          ]
        });
      } else {
        // check if group already exists, and if so push to it
        if (col.group === previousGroup) {
          group.children[group.children.length - 1].children.push({
            headerName: col.name,
            field: col.name,
            headerClass
          });
        } else {
          group.children.push({
            headerName: col.group,
            headerClass,
            children: [
              {
                headerName: col.name,
                field: col.name,
                headerClass
              }
            ]
          });
        }
        previousGroup = col.group;
      }
    });
    return group;
  };

  const onGridReady = (event: GridReadyEvent) => {
    setGridApi(event.api);
    setColumnApi(event.columnApi);

    // Auto size columns
    // @ts-ignore
    // gridApi.sizeColumnsToFit();
  };

  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "500px",
        width: "100vw"
      }}
    >
      <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        rowData={rowData}
        reactNext
        defaultColDef={{
          sortable: true,
          filter: true
        }}
        frameworkComponents={frameworkComponents}
      />
    </div>
  );
};

export { AgGrid };
