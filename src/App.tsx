import React, { useState, useEffect } from "react";
import { EditorContainer } from './components';
import { getJsonFromSceSim, getJsonFromDmn } from './components/utils';
import { Bullseye, Stack, StackItem, Title } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import classNames from 'classnames';
import '@patternfly/react-core/dist/styles/base.css';
import "@patternfly/patternfly/patternfly-addons.css";
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
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setTransitionDone(true);
        }, 1);
      }, 1000);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const LoadingComponent = (
    <Bullseye>
      <div className="pf-l-flex pf-m-column">
        <div className="pf-l-flex__item" style={{ textAlign: 'center' }}>
          <Spinner />
        </div>
        <div>
          <Title headingLevel="h1" size="xl" className="pf-u-mt-md">Loading scenario</Title>
        </div>
      </div>
    </Bullseye>
  );

  return (
    <div className="App">
      {isLoading ? LoadingComponent : (
        <div className={classNames('editor-container', isTransitionDone && 'show')}>
          <EditorContainer data={data} model={model} />
        </div>
      )}
    </div>
  );
};

export default App;
