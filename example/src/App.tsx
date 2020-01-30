import '@patternfly/react-core/dist/styles/base.css';
import React, { useState, useEffect } from "react";
// import { EditorContainer, Spinner } from 'sce-sim-grid';
import { EditorContainer, Spinner } from './sym_src';
import classNames from 'classnames';
import { Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import './App.css';

const App: React.FC = () => {
  const [state, setState] = useState({
    exampleOne: '',
    exampleTwo: '',
    data: '',
    model: '',
    isLoading: true,
    isExpanded: false,
    isTransitionDone: false,
    selected: '' as any
  });

  useEffect(() => {
    Promise.all([
      fetch('/data/Violation Scenarios.scesim'),
      fetch('/data/Example2.scesim'),
      fetch('/data/Traffic Violation2.dmn')
    ])
    .then(([res1, res2, res3]) => Promise.all([res1.text(), res2.text(), res3.text()]))
    .then(([sceSimData1, sceSimData2, dmnData]) => {
      setState(prevState => ({
        ...prevState,
        exampleOne: sceSimData1,
        exampleTwo: sceSimData2,
        data: sceSimData1,
        model: dmnData,
        isLoading: false
      }));
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          isTransitionDone: true
        }));
      }, 1);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const onToggle = (isExpanded: boolean) => {
    setState(prevState => ({
      ...prevState,
      isExpanded
    }));
  };

  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string | SelectOptionObject, isPlaceholder?: boolean) => {
    if (isPlaceholder) clearSelection();
    if (state.selected === selection) {
      onToggle(false);
    } else {
      onToggle(false);
      let selectedExample: any;
      if (selection === 'Example 1') {
        selectedExample = state.exampleOne;
      } else {
        selectedExample = state.exampleTwo;
      }
      setState(prevState => ({
        ...prevState,
        selected: selection,
        data: selectedExample
      }));
    }
  };

  const clearSelection = () => {
    setState(prevState => ({
      ...prevState,
      selected: null
    }));
    onToggle(false);
  };

  const options = [
    'Example 1',
    'Example 2'
  ];

  const selectOptions = options.map((option: string, index: number) => (
    <SelectOption key={index} value={option} isSelected={index === 0} />
  ));

  return (
    <div className="App">
      {state.isLoading ? <Spinner text="Loading scenarios" /> : (
        <>
          {/* <div>
            <Select
              className="data-select"
              toggleId="toggle data"
              variant="single"
              aria-label="Select Input"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={state.selected}
              isExpanded={state.isExpanded}
              ariaLabelledBy="typeahead-select-id"
            >
              {selectOptions}
            </Select>
          </div> */}
          <div className={classNames('editor-container', state.isTransitionDone && 'show')}>
            <EditorContainer data={state.data} model={state.model} showSidePanel={true} readOnly={false} pagingVariant="pagination" />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
