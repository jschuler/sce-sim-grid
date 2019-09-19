import * as React from "react";
import { TextInput, Tooltip } from '@patternfly/react-core';
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
  const [overflown, setOverflown] = React.useState<boolean>(false);

  const getActiveElement = () => {
    return (document && document.activeElement && document.activeElement.getAttribute('id')) || id;
  };

  const setCaretPosition = (el: any, caretPos: number) => {
    // (el.selectionStart === 0 added for Firefox bug)
    if (el.selectionStart || el.selectionStart === 0) {
      el.focus();
      el.setSelectionRange(caretPos, caretPos);
      return true;
    }
  }

  const setCaretPositionAtEnd = () => {
    const el = document.getElementById(id) as HTMLInputElement;
    const end = el.value.length;
    setCaretPosition(el, end);
  };

  /**
   * Copy contents of cell that is not in editing mode
   */
  const copyToClipboard = () => {
    /* Get the text field */
    const copyText = document.getElementById(id) as HTMLInputElement;
    if (copyText) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      /* Copy the text inside the text field */
      document.execCommand('copy');
      // do not mark the whole text as selected
      setCaretPositionAtEnd();
      console.log(`Copied the text: ${copyText.value}`);
    }
  };

  const handleTextInputChange = (value: any) => {
    console.log('handleTextInputChange');
    setValue(value);
  }

  // copy cell
  useKeyPress(/c/i, (event: any) => {
    if (isReadOnly) {
      // if not in editing mode, copy the whole cell
      copyToClipboard();
    }
  }, id, true);

  /**
   * Enters editing mode for the currently focused cell and overwrites the content
   */
  useKeyPress(/^[a-z0-9]$/i, (event: any) => {
    if (!isActive) {
      onActivateInput(id);
      console.log(`setting value: ${event.key}`)
      setValue(event.key);
      setTimeout(() => setActive(true), 1);
    }
  }, id);

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
      setCaretPositionAtEnd();
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

  const onGainFocus = (event: any) => {
    setCaretPositionAtEnd();
  }

  const onMouseOver = (event: any) => {
    const element = event.target;
    const isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    console.log(`isOverflown: ${isOverflown}`);
    setOverflown(isOverflown);
  }

  const input = (
    <TextInput 
      onMouseOver={(event) => onMouseOver(event)}
      className="editor-input" 
      isReadOnly={isReadOnly} 
      style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
      value={value} 
      type="text" 
      onChange={(value: any) => isActive && handleTextInputChange(value)}
      onBlur={onLoseFocus}
      onFocus={onGainFocus}
      aria-label={value} 
      id={id} 
    />
  );

  return <Tooltip content={value} distance={0} trigger={overflown ? 'mouseenter focus' : 'manual'}>{input}</Tooltip>;

  // return overflown ? (
  //   <Tooltip content={value} distance={0}>{input}</Tooltip>
  // ) : input;
};

export { Input };
