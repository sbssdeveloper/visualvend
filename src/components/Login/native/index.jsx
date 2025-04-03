import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  AppLogo,
  CheckboxMarked,
  EyeOff,
  Uncheckbox,
} from "../../../Assets/native/images";

// import CustomButton from '../../components/customButton';
import { useFormik } from "formik";
import * as Yup from "yup";
// import useLogin from '../../hooks/useLogin';
import { CommonActions } from "@react-navigation/native";
import appStyles, { fonts } from "../../../Assets/native/appStyles";
import { navigationKeys } from "../../../Helpers/native/constants";
import { colors } from "../../../Assets/native/colors";
import CustomButton from "../../../Widgets/native/customButton";
import useMutationData from "../../../Hooks/useCommonMutate";
import { login } from "../action";
import {
  setClient,
  setRoleBaseDetails,
  setToken,
} from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { showToaster } from "../../../Widgets/native/commonFunction";
import { ValidatonErroMsg } from "../../../Widgets/native/ValidationErrors";

const ValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Signin = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(true);

  const handleSuccess = async (data) => {
    const { token, client_id, menus, reports } = data?.data?.data || {};
    if (!token) return;
    showToaster("success", data?.data?.message);
    navigation.navigate(navigationKeys.appDrawer);
    dispatch(setToken(token));
    dispatch(setClient(client_id));
    console.log(data?.data?.data);
    dispatch(setRoleBaseDetails({ menus, reports }));
  };

  const handelError = (err) => showToaster("error", err?.data?.message);

  const loginRequest = useMutationData(
    login,
    (data) => handleSuccess(data),
    (error) => handelError(error)
  );

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isValid,
  } = useFormik({
    validationSchema: ValidationSchema,
    initialValues: { username: "99224488", password: "884422009" },
    onSubmit: (values) => {
      loginRequest.mutate({
        username: values?.username,
        password: values?.password,
      });
    },
  });

  return (
    <SafeAreaView style={{ backgroundColor: colors.appBackground }}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={[
          appStyles.mainContainer,
          { backgroundColor: appStyles.appBackground },
        ]}
      >
        <View>
          <View style={signInStyles.logoContainer}>
            <AppLogo />
          </View>

          <View style={signInStyles.textContainer}>
            <Text style={signInStyles.signInText}>Sign in to Your Account</Text>
          </View>

          <View style={[signInStyles.textInputContainer]}>
            <TextInput
              placeholder="Enter username"
              maxLength={50}
              value={values.username}
              placeholderTextColor={"#777777"}
              style={signInStyles.textInputStyle}
              returnKeyType="done"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
            />
          </View>

          {errors.username && touched.username && (
            <ValidatonErroMsg text={errors.username} />
          )}

          <View style={[signInStyles.textInputContainer]}>
            <TextInput
              placeholder="Enter password"
              secureTextEntry={showPassword}
              maxLength={50}
              value={values.password}
              placeholderTextColor={"#777777"}
              style={signInStyles.textInputStyle}
              returnKeyType="done"
              autoComplete="password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <EyeOff height={25} width={25} />
            </TouchableOpacity>
          </View>

          {errors.password && touched.password && (
            <ValidatonErroMsg text={errors.password} />
          )}

          <View
            style={[
              appStyles.rowSpaceBetweenAlignCenter,
              { alignSelf: "center", flex: 1, gap: 5 },
            ]}
          >
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <CheckboxMarked height={20} width={20} />
              ) : (
                <Uncheckbox height={20} width={20} />
              )}
            </TouchableOpacity>

            <Text style={[signInStyles.RememberMeText, fonts.mediumm]}>
              Terms & Conditions
            </Text>
          </View>
          {/* <Text style={signInStyles.forgotPassText}>Forgot password?</Text> */}

          <View style={{ paddingVertical: 20 }}>
            <CustomButton
              text={"Continue"}
              onPress={handleSubmit}
              style={[
                !rememberMe || loginRequest?.isPending
                  ? appStyles?.touchableButtonGreyDisabled
                  : appStyles.touchableButtonCyan,
              ]}
              disabled={!rememberMe || !isValid || loginRequest?.isPending}
              isPending={loginRequest?.isPending}
            />
          </View>

          <View style={{ alignSelf: "flex-end", marginTop: 50 }}>
            <Text style={signInStyles.RememberMeText}>Version 1.1.11</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;

const signInStyles = StyleSheet.create({
  logoContainer: {
    paddingTop: "30%",
    alignSelf: "center",
  },

  textContainer: {
    alignSelf: "center",
    paddingVertical: 20,
    paddingTop: "30%",
  },

  signInText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222222",
  },

  textInputContainer: {
    height: 50,
    padding: 5,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  textInputStyle: {
    flex: 1,
    fontSize: 14,
    color: colors.pureBlack,
    //fontFamily: 'RoobertTRIAL-Medium',
    backgroundColor: colors.transparent,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxContainer: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#149CBE",
    marginRight: "3%",
  },

  btnStyle: {
    backgroundColor: "#149CBE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  forgotPassText: {
    fontSize: 12,
    color: "#149CBE",
    fontWeight: "500",
  },

  RememberMeText: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "400",
  },

  btnTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 17,
  },

  unchekBox: {
    height: 11,
    width: 11,
    borderColor: "#149CBE",
    borderWidth: 1,
  },

  plcholderTextColor: {
    color: "#777777",
  },
});
