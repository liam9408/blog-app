import React from 'react';

interface HTMLStringComponentProps {
  htmlString: string;
}

export const HTMLStringComponent = ({
  htmlString,
}: HTMLStringComponentProps) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};
