import { useEffect } from 'react';
type Props = {
  onFetchMore: () => void;
  hasMore: boolean;
};
export function useInfinitScroll({ hasMore, onFetchMore }: Props) {
  console.log(hasMore);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 30
      ) {
        if (hasMore) {
          onFetchMore();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, onFetchMore]);
}
