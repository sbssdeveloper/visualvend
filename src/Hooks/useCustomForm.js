import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const formOptions = { mode: "all", reValidateMode: "onChange" };

export const useCustomForm = ({ defaultValues = {}, schema = null }) => {
    formOptions.defaultValues = defaultValues;
    if (schema) formOptions.resolver = yupResolver(schema);
    const { handleSubmit, register, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm(formOptions);
    return { handleSubmit, register, errors, watch, setValue, reset, isSubmitting };
};

