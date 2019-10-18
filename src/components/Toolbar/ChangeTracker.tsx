import React from 'react';
import {
  Button,
  ToolbarItem,
  Expandable
} from '@patternfly/react-core';
import { UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { focusCell } from '../utils';

const ChangeTracker = React.memo<{ 
  undoRedo: any,
  onUndo: any,
  onRedo: any
}>(({ undoRedo, onUndo, onRedo }) => {
  console.log('render ChangeTracker');

  const [stateFromProps, setStateFromProps] = React.useState({ 
    undoRedo
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
  const focusElement = (id: string) => {
    focusCell(id, 250, true);
  }

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
      return (
        <Expandable toggleText={getChangeText()} className="kie-changes pf-u-mx-sm">
          <div className="pf-c-content">
            <dl>
              {stateFromProps.undoRedo.undoList.map((change: any, index: number) => (
                <React.Fragment key={index}>
                  <dt><Button variant="link" onClick={() => focusElement(change.id)} isInline>{change.id}</Button></dt>
                  <dd>{change.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Expandable>
      );
    } else {
      return input;
    }
  }

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
}, (prevProps, nextProps) => {
  if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length || JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
    // last changed cell has changed, re-render
    return false;
  }
  if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length || JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
    // last changed cell has changed, re-render
    return false;
  }
  return true;
});

// @ts-ignore
ChangeTracker.whyDidYouRender = {
  customName: 'ChangeTracker'
};

export { ChangeTracker };