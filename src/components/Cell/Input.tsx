import { Tooltip } from '@patternfly/react-core';
import * as React from 'react';
import { setCaretPositionAtEnd, useKeyPress  } from '../utils';
import './Input.css';

const Input = React.memo<{
  originalValue: any,
  path: string,
  cellId: string,
  rowId: string,
  type?: string,
  isReadOnly: boolean,
  deactivateAndFocusCell: any,
  setEditable: any,
  onSave: any,
}>(({
  originalValue,
  path,
  cellId,
  rowId,
  type,
  isReadOnly,
  deactivateAndFocusCell,
  setEditable,
  onSave,
}) => {
  // console.log(`render Input`);
  const [value, setValue] = React.useState<any>(originalValue);
  const [savedValue, setSavedValue] = React.useState<any>(originalValue);
  const [overflown, setOverflown] = React.useState<boolean>(false);
  // const [changes, setChanges] = React.useState<any[]>([]);
  const [isReadOnlyState, setReadOnlyState] = React.useState<boolean>(isReadOnly);

  React.useEffect(() => {
    // sync prop to state
    if (isReadOnly !== isReadOnlyState) {
      setReadOnlyState(isReadOnly);
    }
  }, [isReadOnly]);

  React.useEffect(() => {
    if (isReadOnlyState) {
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
    return document.getElementById(cellId) as HTMLInputElement;
  };

  React.useEffect(() => {
    if (!isReadOnlyState) {
      // set caret at the end of the input
      setTimeout(() => {
        const element = thisElement();
        element && setCaretPositionAtEnd(thisElement());
      }, 1);
    }
  });

  /**
   * Set the value on input
   */
  const handleTextInputChange = (event: any) => {
    setValue(event.currentTarget.value);
  };

  /**
   * Saves the current value
   */
  const save = () => {
    if (savedValue !== value) {
      // setChanges((prevState: any) => ([...prevState, {
      //   value,
      //   previousValue: savedValue
      // }]));
      setSavedValue(value);
      if (onSave) {
        onSave(cellId, value, originalValue, rowId);
      }
    }
  };

  /**
   * save current input
   */
  const onEnter = (event: any) => {
    // save operation
    save();
    // mark itself as not editable but maintain focus
    // deactivateAndFocusCell(event.target.cellId);
    setEditable('');
    setReadOnlyState(true);
  };

  /**
   * Reverts input to previous saved value if changed
   */
  const onEscape = (event: any) => {
    if (savedValue !== value) {
      setValue(savedValue);
    }
    // mark itself as not editable but maintain focus
    // deactivateAndFocusCell(event.target.cellId);
    setEditable('');
    setReadOnlyState(true);
  };

  useKeyPress('Escape', onEscape, {
    log: 'input',
    cellId,
    isActive: !isReadOnlyState,
  });
  useKeyPress('Enter', onEnter, {
    log: 'input',
    cellId,
    isActive: !isReadOnlyState,
  });

  /**
   * When the element loses focus
   * Save the value and notify the Editor that we're not editable anymore
   */
  const onLoseFocus = (event: any) => {
    if (!isReadOnlyState) {
      setReadOnlyState(true);
      // setEditable('');
      save();
    }
  };

  /**
   * Check if the element is overflown
   */
  const checkForOverflow = (event?: any) => {
    const element = event ? event.target : thisElement();
    const isOverflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    setOverflown(isOverflown);
  };

  const input = (
    <input
      onMouseOver={checkForOverflow}
      className="editor-input truncate"
      style={{ cursor: isReadOnlyState ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }}
      value={value}
      type="text"
      onChange={handleTextInputChange}
      onBlur={onLoseFocus}
      aria-label={value}
      id={cellId}
      readOnly={isReadOnlyState}
    />
  );
  return <Tooltip content={value} distance={0} exitDelay={0} trigger={overflown ? 'mouseenter focus' : 'manual'}>{input}</Tooltip>;
}, (prevProps, nextProps) => {
  const shouldRerender = (prevProps.isReadOnly !== nextProps.isReadOnly) || (prevProps.originalValue !== nextProps.originalValue);
  if (shouldRerender) {
    // console.log(`re-render Input ${nextProps.cellId}`)
    return false;
  }
  return true;
});

// @ts-ignore
Input.whyDidYouRender = {
  customName: 'Input',
};

export { Input };
