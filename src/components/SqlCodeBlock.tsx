import * as React from 'react';

import { CodeBlock, dracula } from 'react-code-blocks';

interface SqlCodeBlockProps {
  text: string;
}

const SqlCodeBlock: React.FC<SqlCodeBlockProps> = ({ text }) => (
  <CodeBlock
    text={text}
    language="sql"
    theme={dracula}
  />
);

export default SqlCodeBlock;
