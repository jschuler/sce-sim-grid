import * as React from "react";
import { TextInput } from '@patternfly/react-core';

const Input: React.FC<{ originalValue: any, path: string, id?: any, type?: string }> = ({ originalValue, path, id, type }) => {
  const [value, setValue] = React.useState<any>(originalValue);

  const handleTextInputChange = (value: any) => {
    setValue(value);
  }

  return (
    <TextInput style={{ border: 'none' }} value={value} type="text" onChange={(value: any) => handleTextInputChange(value)} aria-label={value} id={id} />
  );
};

export { Input };
