import * as React from "react";
import { Title, Expandable, TextContent } from '@patternfly/react-core';
import { Drawer, DrawerContent } from '@patternfly/react-core/dist/js/experimental';
import { Editor } from './Editor';
import { DefinitionsDrawerPanel } from './DrawerPanel';
import { getDefinitions } from "./utils";

const EditorContainer: React.FC<{ data: any, model: any }> = ({ data, model }) => {
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(true);

  const definitions = getDefinitions(model);
  console.log(`definitions:`);
  console.log(definitions);

  return (
    <div className="pf-m-redhat-font">
      <Drawer isExpanded={isDrawerExpanded} isInline>
        <DrawerContent>
          <div className="pf-u-m-lg">
            <Title headingLevel="h1" size="2xl" className="pf-u-mb-md">{definitions._title}</Title>
            <Editor data={data} definitions={definitions} />
          </div>
        </DrawerContent>
        <DefinitionsDrawerPanel definitions={definitions} />
      </Drawer>
    </div>
  )
};

export { EditorContainer };
