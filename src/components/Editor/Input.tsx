import * as React from "react";
import { TextInput, Tooltip } from '@patternfly/react-core';
import { useKeyPress } from './useKeyPress'; 
import './Input.css';

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

  const thisElement = () => {
    return document.getElementById(id) as HTMLInputElement;
  }

  const setCaretPosition = (el: any, caretPos: number) => {
    // (el.selectionStart === 0 added for Firefox bug)
    if (el.selectionStart || el.selectionStart === 0) {
      el.focus();
      el.setSelectionRange(caretPos, caretPos);
      return true;
    }
  }

  const setCaretPositionAtEnd = () => {
    const el = thisElement();
    const end = el.value.length;
    setCaretPosition(el, end);
  };

  /**
   * Copy contents of cell that is not in editing mode
   */
  const copyToClipboard = () => {
    /* Get the text field */
    const copyText = thisElement();
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

  /**
   * Copy cell listener
   */
  const onCopy = (event?: any) => {
    if (isReadOnly) {
      // if not in editing mode, copy the whole cell
      copyToClipboard();
    }
  };

  /**
   * Enters editing mode for the currently focused cell and overwrites the content
   */
  const onOtherKeysPress = (event: any) => {
    if (!isActive) {
      onActivateInput(id);
      console.log(`setting value: ${event.key}`)
      setValue(event.key);
      setTimeout(() => setActive(true), 1);
    }
  };

  /**
   * either save current input, or enter editing mode
   */
  const onEnter = () => {
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
  };

  const onEscape = () => {
    console.log('revert cell changes');
    setValue(savedValue);
    setActive(false);
  };

  useKeyPress(/c/i, (event: any) => onCopy(event), {
    id, 
    withModifier: true,
    isActive: !isReadOnly
  });
  useKeyPress('Escape', () => onEscape(), { 
    id,
    isActive: !isReadOnly
  });
  useKeyPress(/^[a-z0-9]$/i, (event: any) => onOtherKeysPress(event), { 
    id,
    isActive: !isReadOnly
  });
  useKeyPress('Enter', () => onEnter(), { 
    id,
    isActive: !isReadOnly
  });

  const onLoseFocus = (event: any) => {
    console.log(`lost focus for id ${id}, save value: ${value}`);
    setSavedValue(value);
    setActive(false);
  };

  const onGainFocus = (event: any) => {
    onMouseOver();
    setCaretPositionAtEnd();
  }

  const onMouseOver = (event?: any) => {
    const element = event ? event.target : thisElement();
    const isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    console.log(`isOverflown: ${isOverflown}`);
    setOverflown(isOverflown);
  }

  return (
    <>
      {isReadOnly ? (
        <input 
          className="pf-c-form-control editor-input" 
          style={{ cursor: 'default', textAlign: type === 'string' ? 'left' : 'center' }} 
          type="text" 
          defaultValue={`read-only ${value}`}
          id={id}
          aria-label={value}
          readOnly
        />
      ) : (
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
      )}
    </>);

  // return (
  //   // @ts-ignore
  //   <Tooltip content={value} distance={0} exitDelay={0} trigger={overflown ? 'mouseenter focus' : 'manual'} tippyProps={{ isEnabled: false }}>
  //     {isReadOnly ? (
  //       <input 
  //         className="pf-c-form-control editor-input" 
  //         style={{ cursor: 'default', textAlign: type === 'string' ? 'left' : 'center' }} 
  //         type="text" 
  //         defaultValue={`read-only ${value}`}
  //         id={id}
  //         aria-label={value}
  //         readOnly        
  //       />
  //     ) : (
  //       <TextInput 
  //         onMouseOver={(event) => onMouseOver(event)}
  //         className="editor-input" 
  //         isReadOnly={isReadOnly} 
  //         style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
  //         value={value} 
  //         type="text" 
  //         onChange={(value: any) => isActive && handleTextInputChange(value)}
  //         onBlur={onLoseFocus}
  //         onFocus={onGainFocus}
  //         aria-label={value} 
  //         id={id} 
  //       />
  //     )}
  //   </Tooltip>);
};

export { Input };
