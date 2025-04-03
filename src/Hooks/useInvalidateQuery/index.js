import { useQueryClient } from '@tanstack/react-query';
const useInvalidateQuery = () => {
    const queryClient = useQueryClient();
    const invalidateQuery = (keyName) => {
        queryClient.invalidateQueries([keyName]);
    };
    return { invalidateQuery }
};

export default useInvalidateQuery;
