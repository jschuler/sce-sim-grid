import * as React from "react";
import { Form, TextInput, Expandable, TextContent, Button } from '@patternfly/react-core';
import { AngleRightIcon, AngleLeftIcon, TimesIcon } from '@patternfly/react-icons';
import { DrawerPanelContent } from '@patternfly/react-core/dist/js/experimental';
import { FilteredRowsContext } from './EditorContainer';
import './DrawerPanel.scss';

const DefinitionsDrawerPanel: React.FC<{ rows: any[], closeDrawer: any }> = ({ rows, closeDrawer }) => {
  const [activeItem, setActiveItem] = React.useState('');
  // const [searchValue, setSearchValue] = React.useState('');
  const { updateRows, definitions } = React.useContext(FilteredRowsContext);

  const onToggle = (id: string) => {
    console.log(`selected: ${id}`);
    setActiveItem(id);
  };

  const handleSearchChange = (checked: any, event: any) => {
    // setSearchValue(event.target.value);
    const searchRE = new RegExp(event.target.value, 'i');
    const filteredRows = rows.filter((row: any) => {
      let found = false;
      for (let col of row) {
        if (col && searchRE.test(col.value)) {
          found = true;
          break;
        }
      }
      return found;
    });
    updateRows(filteredRows);
  };

  // DrawerPanelContent
  return (
    <div>
      {/* <button className="pf-c-button pf-m-secondary close-section" type="button" aria-label="Close">
        <AngleRightIcon />
      </button> */}
      {/* <button className="pf-c-button pf-m-plain close-button" type="button" aria-label="Close" onClick={closeDrawer}>
        <TimesIcon size="sm" />
      </button> */}
      <TextContent className="pf-u-m-lg">
        {/* <Form className="search-icons pf-u-my-lg" onSubmit={event => { event.preventDefault(); return false; }}>
          <TextInput
              type="text"
              id="gridSearch"
              name="gridSearch"
              placeholder="Search grid"
              aria-label="Search grid"
              // value={searchValue}
              onChange={handleSearchChange}
            />
        </Form> */}
        <p>To create a test template, define the "Given" and "Expect" columns by using the expression editor below.</p>
        <h2>Select Data Object</h2>
        <h3>Complex Types</h3>
        {definitions.complex.map((item: any) => (
          <Expandable key={item.typeRef} toggleText={item.text} onToggle={() => onToggle(item.text)}>
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
          <Expandable key={item.typeRef} toggleText={item.text} onToggle={() => onToggle(item.text)}>
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
