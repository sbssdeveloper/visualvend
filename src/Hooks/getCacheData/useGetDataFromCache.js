import { useQueryClient } from '@tanstack/react-query';

const useGetDataFromCache = (queryKey) => {
  const queryClient = useQueryClient();
  
  const cachedData = queryClient.getQueryData("CLIENTLIST");
  console.log(cachedData,"====>CAhcheddd Data")

  return cachedData;
};

export default useGetDataFromCache;
