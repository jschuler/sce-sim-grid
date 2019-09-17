import React, { useState, useEffect } from "react";
import { Editor } from './components';

const App: React.FC = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/ViolationScenarios.json", {
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        setData(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      {data ? <Editor data={data} /> : "Loading"}
    </div>
  );
};

export default App;
