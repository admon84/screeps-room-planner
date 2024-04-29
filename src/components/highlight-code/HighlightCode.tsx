import { PropsWithChildren, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

export default function HighlightCode({ children }: PropsWithChildren) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return <code className='language-json'>{children}</code>;
}
