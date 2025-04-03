import { useInfiniteQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message'; // Ensure you import the correct toast library

export default function useInfiniteFetchData({ key, fn, ...extraParams }) {

  const useInfiniteDataRequest = useInfiniteQuery({
    queryKey: [key, { ...extraParams }],
    queryFn: ({ pageParam = 1, queryKey }) => {
      const params = { page: pageParam, ...queryKey[1] };
      const { extraParamsForFunction, ...rest } = params;
      return fn(rest, extraParamsForFunction);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.data?.pagination?.hasNextPage ?? false,
    select: (data) => data?.pages?.flatMap(page => page?.data?.data) ?? [],
    onError: (error) => {
      Toast.show({
        position: 'top',
        type: 'error',
        text1: 'Error!',
        text2: error.message,
      });
    },
 
  });

  return {
    data: useInfiniteDataRequest.data ?? [],
    isFetching: useInfiniteDataRequest.isFetching,
    isPending: useInfiniteDataRequest.isLoading,
    hasNextPage: useInfiniteDataRequest.hasNextPage,
    fetchNextPage: useInfiniteDataRequest.fetchNextPage,
    isFetchingNextPage: useInfiniteDataRequest.isFetchingNextPage,
  };
}
