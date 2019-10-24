/**
 * Loading spinner used when loading the app and when loading the next page for the grid infinite scrolling
 */
import * as React from 'react';
import { SpinnerProps } from '@patternfly/react-core/dist/js/experimental';
declare const Spinner: React.SFC<{
    text?: string;
    className?: string;
    size?: SpinnerProps['size'];
}>;
export { Spinner };
