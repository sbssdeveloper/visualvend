import { useMutation, } from "@tanstack/react-query";
const useMutationData = (mutationFunction, onSuccessHandler, onErrHandler) => {
  const mutationHandler = useMutation({
    mutationFn: mutationFunction,
    onSuccess: (data) =>onSuccessHandler(data),
    onError: (error) => onErrHandler(error)
  });
  return mutationHandler;
};
export default useMutationData;
