import { useState, useCallback, useRef } from 'react';

export function useInfiniteScroll(fetchMore) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
        fetchMore(page + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, fetchMore, page]);

  return { lastElementRef, loading, setLoading, hasMore, setHasMore, page, setPage };
}