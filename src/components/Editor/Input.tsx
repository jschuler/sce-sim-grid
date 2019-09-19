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
  isReadOnly?: boolean,
  setActiveInput: any
}> = ({ originalValue, path, id, type, onActivateInput, isReadOnly, setActiveInput }) => {
  const [value, setValue] = React.useState<any>(originalValue);
  const [savedValue, setSavedValue] = React.useState<any>(originalValue);
  const [isActive, setActive] = React.useState<boolean>(false);

  const getActiveElement = () => {
    return (document && document.activeElement && document.activeElement.getAttribute('id')) || id;
  };

  const handleTextInputChange = (value: any) => {
    console.log('handleTextInputChange');
    setValue(value);
  }

  useKeyPress(/^[a-z0-9]$/i, (event: any) => {
    if (!isActive) {
      onActivateInput(id);
      console.log(`setting value: ${event.key}`)
      setValue(event.key);
      setTimeout(() => setActive(true), 1);
    }
  }, id, true);

  // either save current input, or enter editing mode
  useKeyPress('Enter', () => {
    if (isActive) {
      console.log('currently active, will save')
      // save operation
      setSavedValue(value);
      // mark itself as not active
      setActiveInput('');
      setActive(false);
    } else {
      console.log('currently not active, will make active')
      setActive(true);
      onActivateInput(id);
    }
  }, id);

  useKeyPress('Escape', () => {
    console.log('revert cell changes');
    setValue(savedValue);
    setActive(false);
  }, id);

  const onLoseFocus = (event: any) => {
    console.log(`lost focus for id ${id}, save value: ${value}`);
    setSavedValue(value);
    setActive(false);
  };

  return (
    <TextInput 
      className="editor-input" 
      isReadOnly={isReadOnly} 
      style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
      value={value} 
      type="text" 
      onChange={(value: any) => isActive && handleTextInputChange(value)}
      onBlur={onLoseFocus}
      aria-label={value} 
      id={id} 
    />
  );
};

export { Input };
