import "@patternfly/patternfly/patternfly.min.css";
import "@patternfly/patternfly/patternfly-addons.css";
import React, { useState, useEffect } from "react";
import { EditorContainer, Spinner } from './components';
import { getJsonFromSceSim, getJsonFromDmn } from './components/utils';
import classNames from 'classnames';
import { Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [model, setModel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const [isTransitionDone, setTransitionDone] = useState(false);
  const [selected, setSelected] = React.useState<any>();

  useEffect(() => {
    Promise.all([
      fetch('/data/Violation Scenarios.scesim'),
      fetch('/data/Example2.scesim'),
      fetch('/data/Traffic Violation2.dmn')
    ])
    .then(([res1, res2, res3]) => Promise.all([res1.text(), res2.text(), res3.text()]))
    .then(([sceSimData1, sceSimData2, dmnData]) => {
      const sceSimJson1 = getJsonFromSceSim(sceSimData1);
      const sceSimJson2 = getJsonFromSceSim(sceSimData2);
      const dmnJson = getJsonFromDmn(dmnData);
      setData1(sceSimJson1);
      setData2(sceSimJson2);
      setData(sceSimJson1);
      setModel(dmnJson);
      setLoading(false);
      setTimeout(() => {
        setTransitionDone(true);
      }, 1);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string | SelectOptionObject, isPlaceholder?: boolean) => {
    if (isPlaceholder) clearSelection();
    if (selected === selection) {
      onToggle(false);
    } else {
      setSelected(selection);
      onToggle(false);
      if (selection === 'Example 1') {
        setData(data1);
      } else {
        setData(data2);
      }
    }
  };

  const clearSelection = () => {
    setSelected(null);
    onToggle(false);
  };

  const options = [
    'Example 1',
    'Example 2'
  ];

  const selectOptions = options.map((option: string, index: number) => (
    <SelectOption key={index} value={option} isSelected />
  ));

  return (
    <div className="App">
      {isLoading ? <Spinner text="Loading scenarios" /> : (
        <>
          <div>
            <Select
              className="data-select"
              toggleId="toggle data"
              variant="single"
              aria-label="Select Input"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={selected}
              isExpanded={isExpanded}
              ariaLabelledBy="typeahead-select-id"
            >
              {selectOptions}
            </Select>
          </div>
          <div className={classNames('editor-container', isTransitionDone && 'show')}>
            <EditorContainer data={data} model={model} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
