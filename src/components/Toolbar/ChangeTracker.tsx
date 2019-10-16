import React from 'react';
import {
  Button,
  ToolbarItem,
  Expandable
} from '@patternfly/react-core';
import { UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { focusCell } from '../utils';

const ChangeTracker = React.memo<{ 
  changes: any[],
  redoList: any[],
  onUndo: any,
  onRedo: any
}>(({ changes, redoList, onUndo, onRedo }) => {
  console.log('render ChangeTracker');

  const [stateFromProps, setStateFromProps] = React.useState({ 
    changes, 
    redoList
  });

  React.useEffect(() => {
    // sync props to state
    if (changes !== stateFromProps.changes || redoList !== stateFromProps.redoList) {
      setStateFromProps({
        changes,
        redoList
      })
    }
  }, [ changes, redoList ]);

  /**
   * The text to display for the change-tracker
   */
  const getChangeText = () => {
    if (stateFromProps.changes.length === 1) {
      return `1 change`;
    } else {
      return `${stateFromProps.changes.length} changes`;
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
    if (stateFromProps.changes.length) {
      return (
        <Expandable toggleText={getChangeText()} className="kie-changes pf-u-mx-sm">
          <div className="pf-c-content">
            <dl>
              {stateFromProps.changes.map((change: any, index: number) => (
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

  const redoTracker = () => {
    return (
      <Expandable toggleText={(stateFromProps.redoList.length).toString()} className="kie-changes pf-u-mx-sm">
        <div className="pf-c-content">
          <dl>
            {stateFromProps.redoList.map((redo: any, index: number) => (
              <React.Fragment key={index}>
                <dt><Button variant="link" onClick={() => focusElement(redo.id)} isInline>{redo.id}</Button></dt>
                <dd>{redo.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </Expandable>
    );
  }

  return (
    <ToolbarItem>
      <div className="pf-c-input-group">
        <Button onClick={onUndo} variant="control" isDisabled={changes.length === 0}>
          <UndoIcon />
        </Button>
        {changeTracker()}
        {/* {redoTracker()} */}
        <Button onClick={onRedo} variant="control" isDisabled={redoList.length === 0}>
          <RedoIcon />
        </Button>
      </div>
    </ToolbarItem>
  );
}, (prevProps, nextProps) => {
  if (prevProps.changes.length !== nextProps.changes.length || JSON.stringify(prevProps.changes) !== JSON.stringify(nextProps.changes)) {
    // last changed cell has changed, re-render
    return false;
  }
  if (prevProps.redoList.length !== nextProps.redoList.length || JSON.stringify(prevProps.redoList) !== JSON.stringify(nextProps.redoList)) {
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