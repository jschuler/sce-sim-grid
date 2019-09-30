import * as React from 'react';
import { Input } from './Input';
import { Select } from './Select';

const EditorRow: React.FC<{ 
  style: any,
  rowData: any,
  rowIndex: number,
  columnNames: any,
  definitions: any,
  onSelectToggleCallback: any,
  activeInput: any,
  onActivateInput: any,
  setActiveInput: any,
  onCellClick: any,
  onCellDoubleClick: any
}> = ({ 
  style,
  rowData, 
  rowIndex,
  columnNames, 
  definitions, 
  onSelectToggleCallback, 
  activeInput, 
  onActivateInput, 
  setActiveInput,
  onCellClick,
  onCellDoubleClick
}) => {

  const row = rowData[rowIndex];

  return (
    <div className="kie-grid__rule" style={style}>
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
        const typeArr = type.split(', ');
        if (typeArr.length > 1) {
          // Multiple options, render Select
          component = (
            <Select 
              isReadOnly={inputId !== activeInput} 
              id={inputId} 
              onSelectToggleCallback={onSelectToggleCallback} 
              options={typeArr} 
              originalValue={value} 
            />
          );
        } else {
          component = (
            <Input
              isReadOnly={inputId !== activeInput} 
              onActivateInput={onActivateInput} 
              setActiveInput={setActiveInput} 
              originalValue={value} 
              path={path} 
              type={type} 
              id={inputId} 
            />
          );
        }
        return (
          <div className="kie-grid__item" key={inputId} onClick={(event) => onCellClick(event, inputId)} onDoubleClick={(event) => onCellDoubleClick(event, inputId)}>
            {cellIndex === 0 ? value : component}
          </div>
        )
      })}
    </div>
  );
};

export { EditorRow };
