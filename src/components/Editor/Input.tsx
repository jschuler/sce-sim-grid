import * as React from "react";
import { TextInput } from '@patternfly/react-core';
import { useKeyPress } from './useKeyPress'; 
import './input.css';

const Input: React.FC<{ 
  originalValue: any, 
  path: string, 
  id?: any, 
  type?: string, 
  onActivateInput?: any, 
  isReadOnly?: boolean 
}> = ({ originalValue, path, id, type, onActivateInput, isReadOnly }) => {
  const [value, setValue] = React.useState<any>(originalValue);

  const handleTextInputChange = (value: any) => {
    setValue(value);
  }

  useKeyPress('Enter', () => {
    onActivateInput(id);
  }, id);

  return (
    <TextInput 
      className="editor-input" 
      isReadOnly={isReadOnly} 
      style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
      value={value} 
      type="text" 
      onChange={(value: any) => handleTextInputChange(value)} 
      aria-label={value} 
      id={id} 
    />
  );
};

export { Input };
