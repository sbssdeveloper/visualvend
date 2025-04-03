import { useState } from "react";

const createUseMutation = (mutationFn, mutationKey) => {
  return () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const executeMutation = async (variables, onSuccess) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await mutationFn(variables);

        setData(response.data);
        onSuccess(response);
      } catch (error) {
        console.error("error", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    return { executeMutation, loading, error, data, mutationKey };
  };
};

export default createUseMutation;
