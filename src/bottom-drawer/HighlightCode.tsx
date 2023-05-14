import { PropsWithChildren, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import '../css/prism.css';

export default function HighlightCode({ children }: PropsWithChildren) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return <code className='language-json' children={children} />;
}
