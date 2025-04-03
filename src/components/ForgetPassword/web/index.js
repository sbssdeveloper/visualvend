import React from "react";
import Button from "../../../Widgets/web/Button";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useIcons from "../../../Assets/web/icons/useIcons";
import FormInput from "../../../Widgets/web/FormInput";

const initialValues = {
    email: "",
};

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Must be a valid email")
        .required("Email is required"),
});

export default function ForgotPassword() {
    const { BackRoundIcon } = useIcons();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: "onSubmit",
    });

    async function onSubmit(values) {
        console.log("🚀 ~ file: index.js:38 ~ onSubmit ~ values:", values);
    }
    return (
        <div className="w--full">
            <div className="w--full gap--sm d--flex flex--column align-items--center justify-content--center">
                <span className="d--flex m-b--lg w--full justify-content--between">
                    <Button
                        onClick={() => navigate(-1)}
                        btnClasses="btn bg--primary-100 w-max--40 h-max--40"
                        type="button"
                        variant="primary"
                        icon={<BackRoundIcon width={40} height={40} />}
                        color="primary"
                        rounded
                    />
                    <h3 className="font--2xl text--primary">Forgot Password ?</h3>
                    <span></span>
                </span>

                <form
                    className="w--full d--flex flex--column gap--md"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                {...field}
                                type="input"
                                label="Enter your email address, we will send you a recovery email."
                                placeholder="example@gmail.com"
                                error={errors?.email?.message}
                                height="40"
                            />
                        )}
                    />

                    <div className="form-group w--full">
                        <Button
                            type="submit"
                            btnClasses="btn"
                            disabled={isSubmitting}
                            size="md"
                            variant="primary"
                            color="white"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
