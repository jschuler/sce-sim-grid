import * as React from 'react';
import { Title, Button, EmptyState, EmptyStateBody, EmptyStateVariant, Bullseye, EmptyStateIcon } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const Empty: React.SFC<{ onClear: any, className?: string }> = ({ onClear, className }) => (
  <div className="pf-l-flex pf-m-column">
    <div className="pf-l-flex__item" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
      <Bullseye className={className}>
        <EmptyState variant={EmptyStateVariant.small} >
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h2" size="lg">
            No results found
          </Title>
          <EmptyStateBody>
            No results match the filter criteria. Remove all filters or clear all filters to show results.
          </EmptyStateBody>
          <Button variant="link" onClick={onClear}>Clear all filters</Button>
        </EmptyState>
      </Bullseye>
    </div>
  </div>
);

export { Empty };
