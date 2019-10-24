import * as React from "react";
import { Modal, Button } from '@patternfly/react-core';

const HelpModal: React.SFC<{ isOpen: boolean, onClose: any, readOnly: boolean }> = ({ isOpen, onClose, readOnly }) => {
  // console.log('render HelpModal');
  
  return (
    <Modal
      isSmall
      title="Help"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={onClose}>
          Close
        </Button>
      ]}
      isFooterLeftAligned
    >
      <div className="pf-c-content">
        <p>The following keyboard interactions are available:</p>
        <ul>
          <li>Once a cell is selected, arrow keys can be used to navigate between the cells.</li>
          <li>The Tab and Shift+Tab keys can be used to tab to the next and previous cell.</li>
          <li>CMD+C / CTRL+C copies the cell content.</li>
          {!readOnly && <>
            <li>Use the Enter key on a cell to enter editing mode.</li>
            <li>CMD+Z / CTRL+Z undoes the last change.</li>
            <li>CMD+Shift+Z / CTRL+Shift+Z redoes the last change.</li>
            <li>When in editing mode:
              <ul>
                <li>The Enter key will save the current cell contents.</li>
                <li>THe Escape key will reset the cell contents.</li>
              </ul>
            </li>
          </>}
        </ul>
      </div>
    </Modal>
  )
};

export { HelpModal };
