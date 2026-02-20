import { useEffect } from 'react';

const BASE_TITLE = 'Leonardo Dias Costa';

export function usePageTitle(subtitle?: string) {
  useEffect(() => {
    document.title = subtitle ? `${subtitle} | ${BASE_TITLE}` : `${BASE_TITLE} - System Engineer Portfolio`;

    return () => {
      document.title = `${BASE_TITLE} - System Engineer Portfolio`;
    };
  }, [subtitle]);
}
