import * as React from "react";
import { Tooltip } from '@patternfly/react-core';
import { useKeyPress, setCaretPositionAtEnd, focusCell  } from '../utils'; 
import './Input.css';

const Input = React.memo<{ 
  originalValue: any, 
  path: string, 
  id?: any, 
  type?: string, 
  isReadOnly?: boolean,
  deactivateAndFocusCell: any,
  setEditable: any,
  onSave: any
}>(({ 
  originalValue, 
  path, 
  id, 
  type, 
  isReadOnly, 
  deactivateAndFocusCell, 
  setEditable, 
  onSave
}) => {
  const [value, setValue] = React.useState<any>(originalValue);
  const [savedValue, setSavedValue] = React.useState<any>(originalValue);
  const [overflown, setOverflown] = React.useState<boolean>(false);
  const [changes, setChanges] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isReadOnly) {
      // update cell on data changes coming from EditorContainer -> Editor
      if (value !== originalValue) {
        setValue(originalValue);
        setSavedValue(originalValue);
      }
    }
  }, [originalValue]);

  /**
   * Returns the current DOM element
   * 
   * TODO: Possibly change to React refs
   */
  const thisElement = () => {
    return document.getElementById(id) as HTMLInputElement;
  }

  React.useEffect(() => {
    if (!isReadOnly) {
      // set caret at the end of the input
      setTimeout(() => {
        setCaretPositionAtEnd(thisElement());
      }, 1);
    }
  });

  /**
   * Set the value on input
   */
  const handleTextInputChange = (event: any) => {
    setValue(event.currentTarget.value);
  }

  /**
   * Saves the current value
   */
  const save = () => {
    if (savedValue !== value) {
      setChanges([...changes, {
        value,
        previousValue: savedValue
      }]);
      setSavedValue(value);
      onSave && onSave(id, value, originalValue);
    }
  };

  /**
   * save current input
   */
  const onEnter = (event: any) => {
    // save operation
    save();
    // mark itself as not editable but maintain focus
    deactivateAndFocusCell(event.target.id);
  };

  /**
   * Reverts input to previous saved value if changed
   */
  const onEscape = (event: any) => {
    if (savedValue !== value) {
      setValue(savedValue);
    }
    // mark itself as not editable but maintain focus
    deactivateAndFocusCell(event.target.id);
  };

  useKeyPress('Escape', onEscape, { 
    log: 'input',
    id,
    isActive: !isReadOnly
  });
  useKeyPress('Enter', onEnter, { 
    log: 'input',
    id,
    isActive: !isReadOnly
  });

  /**
   * When the element loses focus
   * Save the value and notify the Editor that we're not editable anymore
   */
  const onLoseFocus = (event: any) => {
    if (!isReadOnly) {
      setEditable('');
      save();
    }
  };

  /**
   * When the element receives focus
   */
  const onGainFocus = (event: any) => {
    // TODO: Figure out why the cell needs to be re-focused after tabbing in
    focusCell(id);
  }

  /**
   * Check if the element is overflown
   */
  const checkForOverflow = (event?: any) => {
    const element = event ? event.target : thisElement();
    const isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    setOverflown(isOverflown);
  }

  const input = (
    <input 
      onMouseOver={checkForOverflow}
      className="editor-input truncate" 
      style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
      value={value} 
      type="text" 
      onChange={handleTextInputChange}
      onBlur={onLoseFocus}
      onFocus={onGainFocus}
      aria-label={value} 
      id={id} 
      readOnly={isReadOnly}
    />
  );
  return <Tooltip content={value} distance={0} exitDelay={0} trigger={overflown ? 'mouseenter focus' : 'manual'}>{input}</Tooltip>;
}, (prevProps, nextProps) => {
  // console.log(`${prevProps.originalValue} => ${nextProps.originalValue}`);
  const shouldRerender = (prevProps.isReadOnly !== nextProps.isReadOnly) || (prevProps.originalValue !== nextProps.originalValue);
  if (shouldRerender) {
    // console.log(`re-render Input ${nextProps.id}`)
    return false;
  }
  return true;
});

// @ts-ignore
Input.whyDidYouRender = {
  customName: 'Input'
};

export { Input };
