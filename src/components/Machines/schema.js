import * as yup from "yup";
export const schemaUpsertMachine = (isClient = false) => {
    return yup.object({
        machine_client_id: yup.object().shape({
            value: yup.string()
        }).when({
            is: () => !isClient,
            then: schema => schema.shape({
                value: yup.string().required('Client field is required')
            }),
            otherwise: schema => schema.shape({
                value: yup.string().notRequired()
            })
        }),
        machine_name: yup.string().required('Machine name field is required')
    });
};
