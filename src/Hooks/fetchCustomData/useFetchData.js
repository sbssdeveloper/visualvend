import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message'; // Ensure you import the correct toast library
import { showToaster } from '../../Widgets/native/commonFunction';

export default function useFetchData({ key, fn, ...extraParams }) {

  const queryFn = ({ queryKey }) => {
    const params = queryKey[1] || {};
    const { extraParamsForFunction, ...rest } = params;
    return fn(rest, extraParamsForFunction);
  };

  const fetchedInstance = useQuery({
    queryKey: [key, { ...extraParams }],
    queryFn: queryFn,
    // enabled: !!enabled,
    // refetchOnWindowFocus: !!onMount,
    onSuccess: (data) => {
      const status = data?.status;
      const responseData = data?.data;
      showToaster('success', "Data loaded sucessfully")
    },
    onError: (error) => showToaster('error', error?.message || "Something went wrong")

  });

  return { ...fetchedInstance };
}
