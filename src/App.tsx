import React, { useState, useEffect } from "react";
import { Editor } from './components';
import { getJsonFromSceSim, getJsonFromDmn } from './components/utils';

const App: React.FC = () => {
  const [data, setData] = useState(null);
  const [model, setModel] = useState(null);

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
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className="App">
      {(data && model) ? <Editor data={data} model={model} /> : "Loading"}
    </div>
  );
};

export default App;
