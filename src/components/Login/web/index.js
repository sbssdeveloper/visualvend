import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import useIcons from "../../../Assets/web/icons/useIcons";
import useAuth from "../../../Hooks/useAuth";
import { showErrorToast, showSuccessToast } from "../../../Helpers/web/toastr";
import FormInput from "../../../Widgets/web/FormInput";
import QLogo from "../../../Assets/web/images/QLogo.svg";
import Button from "../../../Widgets/web/Button";
import { login } from "../action";
import useMutationData from "../../../Hooks/useCommonMutate";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    // .email('Must be a valid email')
    .required("username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const { EyeOffIcon, EyeIcon } = useIcons();
  const { setUserToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [signupText, setSignupText] = useState("Sign in");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  // const { executeMutation } = useLoginMutation();

  const handleSuccess = (data) => {
    const status = data?.status;
    const responseData = data?.data;
    setSignupText("Sign in");
    if (status !== 200) {
      showErrorToast(responseData?.message);
      return;
    }
    setUserToken(responseData);
    showSuccessToast("User Login successfully!");
  };

  const loginRequest = useMutationData(login, (data) => {
    handleSuccess(data);
  });

  async function onSubmit(values) {
    loginRequest.mutate(values);
    setSignupText("Please wait...");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="w--full">
      <div className="w--full gap--lg d--flex flex--column align-items--center justify-content--center m-b--xl">
        <img src={QLogo} alt="" width={100} />
        <h5 className="font--md font--500">Sign in to Your Account</h5>
      </div>

      <form
        className="w--full d--flex flex--column gap--lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              type="input"
              label="Username"
              placeholder="Enter your username"
              error={errors?.username?.message}
              height="40"
            />
          )}
        />
        <div className="w--full position--relative">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                id="password"
                autoComplete="false"
                error={errors?.password?.message}
                height="40"
              />
            )}
          />
          <div
            className="inputIcon position--absolute right--10 bottom--4 c--pointer text--black-700"
            onClick={togglePasswordVisibility}
          >
            {!showPassword ? <EyeOffIcon width={18} /> : <EyeIcon width={18} />}
          </div>
        </div>
        <div className="d--flex justify-content--between align-items--center m-b--md">
          <div className="w--full d--flex gap--sm text--black-600 ">
            <input
              type="checkbox"
              className="form--control"
              name="saveCard"
            // onChange={(e) => setSaveCard(e.target.checked)}
            />
            Remember me
          </div>
          <Link
            to="/forgot-password"
            className="text--primary font--sm w--full d--flex justify-content--end c--pointer"
          >
            Forgot password?
          </Link>
        </div>
        <div className="form-group w--full">
          <Button
            btnClasses="btn font--md"
            type="submit"
            disabled={isSubmitting}
            size="md"
            variant="primary"
            color="white"
          >
            {" "}
            {signupText}
          </Button>
        </div>
      </form>
    </div>
  );
}
