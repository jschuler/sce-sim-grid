import * as React from "react";
import { Expandable, TextContent, Button } from '@patternfly/react-core';
import { FilteredRowsContext } from './EditorContainer';
import './DrawerPanel.scss';

const DefinitionsDrawerPanel: React.SFC = () => {
  const { definitions } = React.useContext(FilteredRowsContext);

  console.log('render DefinitionsDrawerPanel');
  return (
    <div>
      <TextContent className="pf-u-m-lg">
        <p>To create a test template, define the "Given" and "Expect" columns by using the expression editor below.</p>
        <h2>Select Data Object</h2>
        <h3>Complex Types</h3>
        {definitions.complex.map((item: any) => (
          <Expandable key={item.typeRef} toggleText={item.text}>
            {Object.keys(item.elements).map((elementKey: any) => (
              <div className="pf-u-mb-sm" key={elementKey}>
                <Button variant="link">{elementKey}</Button>
                <span> [{item.elements[elementKey]}]</span>
              </div>
            ))}
          </Expandable>
        ))}
        
        <h3>Simple Types</h3>
        {definitions.simple.map((item: any) => (
          <Expandable key={item.typeRef} toggleText={item.text}>
            {Object.keys(item.elements).map((elementKey: any) => (
              <div className="pf-u-mb-sm" key={elementKey}>
                <Button variant="link">{elementKey}</Button>
                <span> [{item.elements[elementKey]}]</span>
              </div>
            ))}
          </Expandable>
        ))}
      </TextContent>
    </div>
  )
};

export { DefinitionsDrawerPanel };
