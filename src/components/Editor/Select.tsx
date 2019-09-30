import * as React from "react";
import { TextInput, Tooltip, Select as PfSelect, SelectOption, SelectVariant, SelectOptionObject, SelectProvider } from '@patternfly/react-core';
import { useKeyPress } from './useKeyPress'; 
import './Input.css';
import './Select.css';

const Select: React.FC<{ 
  originalValue?: any, 
  path?: string, 
  id?: any, 
  type?: string, 
  onActivateInput?: any, 
  isReadOnly?: boolean,
  setActiveInput?: any,
  onSelectToggleCallback?: any,
  options: any
}> = ({ originalValue, path, id, type, onActivateInput, isReadOnly, setActiveInput, onSelectToggleCallback, options }) => {
  const [value, setValue] = React.useState<any>(originalValue);
  const [savedValue, setSavedValue] = React.useState<any>(originalValue);
  const [isActive, setActive] = React.useState<boolean>(false);
  const [overflown, setOverflown] = React.useState<boolean>(false);

  const allOptions = options.map((option: string, index: number) => (
    <SelectOption key={index} value={option} isSelected />
  ));
  const getInitialOption = () => {
    let valueIndex: number = 0;
    for (const [index, option] of options.entries()) {
      if (option === originalValue) {
        valueIndex = index;
        break;
      }
    }
    return (
      <SelectProvider value={{ onSelect: () => {}, onClose: () => {}, variant: 'single' }}>
        {/* {allOptions[valueIndex]} */}
        <SelectOption value={originalValue} />
      </SelectProvider>
    );
  };
  const [isExpanded, setExpanded] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<any>(originalValue);
  const [selectOptions, setSelectOptions] = React.useState<any>(allOptions);

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
    onSelectToggleCallback(id, isExpanded);
  };

  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string | SelectOptionObject, isPlaceholder?: boolean) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      onToggle(false);
      console.log('selected:', selection);
    }
  };

  const clearSelection = () => {
    setSelected(null);
    onToggle(false);
  };

  const customFilter = (e: any) => {
    let input: RegExp;
    try {
      input = new RegExp(e.target.value, 'i');
    } catch (err) {
      input = new RegExp(e.target.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    let typeaheadFilteredChildren =
      e.target.value !== ''
        ? selectOptions.filter((child: any) => input.test(child.props.value))
        : selectOptions;
    return typeaheadFilteredChildren;
  }

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

  // copy cell
  useKeyPress(/c/i, (event: any) => {
    if (isReadOnly) {
      // if not in editing mode, copy the whole cell
      copyToClipboard();
    }
  }, { id, withModifier: true, isActive: !isReadOnly });

  /**
   * Enters editing mode for the currently focused cell and overwrites the content
   */
  // useKeyPress(/^[a-z0-9]$/i, (event: any) => {
  //   if (!isActive) {
  //     onActivateInput(id);
  //     console.log(`setting value: ${event.key}`)
  //     setValue(event.key);
  //     setTimeout(() => setActive(true), 1);
  //   }
  // }, id);

  // either save current input, or enter editing mode
  // useKeyPress('Enter', () => {
  //   if (isActive) {
  //     console.log('currently active, will save')
  //     // save operation
  //     setSavedValue(value);
  //     // mark itself as not active
  //     setActiveInput('');
  //     setActive(false);
  //   } else {
  //     console.log('currently not active, will make active')
  //     setActive(true);
  //     onActivateInput(id);
  //     setCaretPositionAtEnd();
  //   }
  // }, id);

  useKeyPress('Escape', () => {
    console.log('revert cell changes');
    setValue(savedValue);
    setActive(false);
  }, { id, isActive: !isReadOnly });

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

  // const input = (
  //   <TextInput 
  //     onMouseOver={(event) => onMouseOver(event)}
  //     className="editor-input" 
  //     isReadOnly={isReadOnly} 
  //     style={{ cursor: isReadOnly ? 'default' : 'text', textAlign: type === 'string' ? 'left' : 'center' }} 
  //     value={value} 
  //     type="text" 
  //     onChange={(value: any) => isActive && handleTextInputChange(value)}
  //     onBlur={onLoseFocus}
  //     onFocus={onGainFocus}
  //     aria-label={value} 
  //     id={id} 
  //   />
  // );

  // const input = (
  //   <PfSelect
  //     variant={SelectVariant.typeahead}
  //     aria-label="Select a state"
  //     onToggle={onToggle}
  //     onSelect={onSelect}
  //     onClear={clearSelection}
  //     onFilter={customFilter}
  //     selections={selected}
  //     isExpanded={isExpanded}
  //     ariaLabelledBy="typeahead-select-id"
  //     placeholderText="Select a state"
  //   >
  //     {selectOptions}
  //   </PfSelect>
  // );

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
        <PfSelect
          toggleId={id}
          variant={SelectVariant.single}
          aria-label="Select Input"
          onToggle={onToggle}
          onSelect={onSelect}
          selections={selected}
          isExpanded={isExpanded}
          ariaLabelledBy="typeahead-select-id"
        >
          {selectOptions}
        </PfSelect>
      )}
    </>);
};

export { Select };
