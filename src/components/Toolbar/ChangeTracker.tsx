import {
  Button,
  Expandable,
  ToolbarItem,
} from '@patternfly/react-core';
import { RedoIcon, UndoIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { focusCell } from '../utils';
import './ChangeTracker.css';

const ChangeTracker: React.FC<{ 
  undoRedo: any,
  onUndo: any,
  onRedo: any
}> = ({ 
  undoRedo, onUndo, onRedo
}) => {
  // console.log('render ChangeTracker');

  const [stateFromProps, setStateFromProps] = React.useState({
    undoRedo,
  });

  React.useEffect(() => {
    // sync props to state
    setStateFromProps({ undoRedo });
  }, [ undoRedo ]);

  /**
   * The text to display for the change-tracker
   */
  const getChangeText = () => {
    if (stateFromProps.undoRedo.undoList.length === 1) {
      return `1 change`;
    } else {
      return `${stateFromProps.undoRedo.undoList.length} changes`;
    }
  };

  /**
   * When a cell id is clicked in the change-tracker, it scrolls and focuses the corresponding element in the grid
   */
  const focusElement = (id: string, parentId?: string) => {
    // checking for offsetHeight is a trick to see if the element is visible
    if (document.getElementById(id) && document.getElementById(id)!.offsetHeight) {
      focusCell(id, 250, true);
    } else if (parentId && document.getElementById(parentId) && document.getElementById(parentId)!.offsetHeight) {
      focusCell(parentId, 250, true);
    }
  };

  /**
   * The change-tracker element
   */
  const changeTracker = () => {
    const input = (
      <input
        className="pf-c-form-control pf-u-px-md"
        type="button"
        id="textInput10"
        name="textInput10"
        aria-label="Input example with popover"
        value={getChangeText()}
      />
    );
    if (stateFromProps.undoRedo.undoList.length) {
      debugger;
      return (
        <Expandable toggleText={getChangeText()} className="kie-changes pf-u-mx-sm">
          <div className="change-tracker pf-c-content">
            <dl>
              {stateFromProps.undoRedo.undoList.map((change: any, index: number) => (
                <React.Fragment key={index}>
                  <dt><Button variant="link" onClick={() => focusElement(change.id)} isInline={true}>#{change.rowId}</Button></dt>
                  <dd>{change.value}</dd>
                  {change.withRows && change.withRows.map((row: any, subIndex: number) => (
                    <React.Fragment key={`${index}_${subIndex}`}>
                      <dt className="inline-dt">―<Button variant="link" onClick={() => focusElement(row.id, change.id)} isInline={true}>#{row.rowId}</Button></dt>
                      <dd>{row.value}</dd>
                      </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Expandable>
      );
    } else {
      return input;
    }
  };

  // const redoTracker = () => {
  //   return (
  //     <Expandable toggleText={(stateFromProps.redoList.length).toString()} className="kie-changes pf-u-mx-sm">
  //       <div className="pf-c-content">
  //         <dl>
  //           {stateFromProps.redoList.map((redo: any, index: number) => (
  //             <React.Fragment key={index}>
  //               <dt><Button variant="link" onClick={() => focusElement(redo.id)} isInline>{redo.id}</Button></dt>
  //               <dd>{redo.value}</dd>
  //             </React.Fragment>
  //           ))}
  //         </dl>
  //       </div>
  //     </Expandable>
  //   );
  // }

  return (
    <ToolbarItem>
      <div className="pf-c-input-group">
        <Button onClick={onUndo} variant="control" isDisabled={stateFromProps.undoRedo.undoList.length === 0}>
          <UndoIcon />
        </Button>
        {changeTracker()}
        {/* {redoTracker()} */}
        <Button onClick={onRedo} variant="control" isDisabled={stateFromProps.undoRedo.redoList.length === 0}>
          <RedoIcon />
        </Button>
      </div>
    </ToolbarItem>
  );
};

// @ts-ignore
ChangeTracker.whyDidYouRender = {
  customName: 'ChangeTracker',
};

export { ChangeTracker };
