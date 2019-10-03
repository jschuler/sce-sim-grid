import '@patternfly/react-core/dist/styles/base.css';
import "@patternfly/patternfly/patternfly-addons.css";
import React, { useState, useEffect } from "react";
import { EditorContainer } from './components';
import { getJsonFromSceSim, getJsonFromDmn } from './components/utils';
import { Bullseye, Title } from '@patternfly/react-core';
import classNames from 'classnames';
import { Spinner } from './components/Spinner';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState(null);
  const [model, setModel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isTransitionDone, setTransitionDone] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/data/Violation Scenarios.scesim'),
      fetch('/data/Traffic Violation.dmn')
    ])
    .then(([res1, res2]) => Promise.all([res1.text(), res2.text()]))
    .then(([sceSimData, dmnData]) => {
      const sceSimJson = getJsonFromSceSim(sceSimData);
      const dmnJson = getJsonFromDmn(dmnData);
      // console.log(sceSimJson);
      // console.log(dmnJson);
      setData(sceSimJson);
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

  return (
    <div className="App">
      {isLoading ? <Spinner text="Loading tests" /> : (
        <div className={classNames('editor-container', isTransitionDone && 'show')}>
          <EditorContainer data={data} model={model} />
        </div>
      )}
    </div>
  );
};

export default App;
