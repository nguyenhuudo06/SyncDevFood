import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import BackButton from "@/components/Material/BackButton";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { callChangePassword } from "@/services/api-call";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import HeaderPage from "@/components/HeaderPage/HeaderPage";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password is at least 6 characters")
    .matches(/^\S*$/, "Password cannot contain spaces")
    .required("Password is required"),
  newPassword: Yup.string()
    .min(6, "Password is at least 6 characters")
    .matches(/^\S*$/, "Password cannot contain spaces")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Confirm password does not match")
    .matches(/^\S*$/, "Password cannot contain spaces")
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const handleChangePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => {
    if (userId == "") {
      Toast.show({
        type: "customToast",
        text1: "You are not logged in!",
        onPress: () => Toast.hide(),
        visibilityTime: 2000,
      });
      //   return;
    }

    setLoading(true);

    try {
      const responseLogin = await callChangePassword(
        userId,
        oldPassword,
        newPassword
      );

      if (responseLogin.status < 200 || responseLogin.status >= 300) {
        throw new Error("Request failed with status " + responseLogin.status);
      }

      Toast.show({
        type: "customToast",
        text1: "Password change successful!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });

      setLoading(false);

        router.replace("../(tabs)/home");
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "customToast",
        text1: "Password change error!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HeaderPage titlePage="Change Password" />
        <View style={{ padding: Spacing }}>
          <Formik
            initialValues={{
              password: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleChangePassword(
                userId ?? "",
                values.password,
                values.newPassword
              );
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={{ marginBottom: Spacing * 1.6 }}>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: [{ translateY: "-50%" }],
                        marginRight: Spacing,
                      }}
                    >
                      {showPassword.password ? (
                        <Entypo
                          name="eye"
                          size={Spacing * 2}
                          color={Colors.primary}
                          style={{ padding: Spacing }}
                        />
                      ) : (
                        <Entypo
                          name="eye-with-line"
                          size={Spacing * 2}
                          color={Colors.gray}
                          style={{ padding: Spacing }}
                        />
                      )}
                    </TouchableOpacity>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={Colors.darkText}
                      secureTextEntry={!showPassword.password}
                      style={styles.input}
                      onChangeText={
                        (text) => handleChange("password")(text)
                        // handleChange("password")(text.trim())
                      }
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                  </View>
                  <View style={styles.showError}>
                    {touched.password && errors.password && (
                      <Text style={[styles.showErrorText]}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginBottom: Spacing * 1.6 }}>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          newPassword: !prev.newPassword,
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: [{ translateY: "-50%" }],
                        marginRight: Spacing,
                      }}
                    >
                      {showPassword.newPassword ? (
                        <Entypo
                          name="eye"
                          size={Spacing * 2}
                          color={Colors.primary}
                          style={{ padding: Spacing }}
                        />
                      ) : (
                        <Entypo
                          name="eye-with-line"
                          size={Spacing * 2}
                          color={Colors.gray}
                          style={{ padding: Spacing }}
                        />
                      )}
                    </TouchableOpacity>
                    <TextInput
                      placeholder="New password"
                      placeholderTextColor={Colors.darkText}
                      secureTextEntry={!showPassword.newPassword}
                      style={styles.input}
                      onChangeText={(text) => handleChange("newPassword")(text)}
                      onBlur={handleBlur("newPassword")}
                      value={values.newPassword}
                    />
                  </View>
                  <View style={styles.showError}>
                    {touched.newPassword && errors.newPassword && (
                      <Text style={[styles.showErrorText]}>
                        {errors.newPassword}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginBottom: Spacing * 1.6 }}>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: [{ translateY: "-50%" }],
                        marginRight: Spacing,
                      }}
                    >
                      {showPassword.confirmPassword ? (
                        <Entypo
                          name="eye"
                          size={Spacing * 2}
                          color={Colors.primary}
                          style={{ padding: Spacing }}
                        />
                      ) : (
                        <Entypo
                          name="eye-with-line"
                          size={Spacing * 2}
                          color={Colors.gray}
                          style={{ padding: Spacing }}
                        />
                      )}
                    </TouchableOpacity>
                    <TextInput
                      placeholder="Confirm password"
                      placeholderTextColor={Colors.darkText}
                      secureTextEntry={!showPassword.confirmPassword}
                      style={styles.input}
                      onChangeText={(text) =>
                        handleChange("confirmPassword")(text)
                      }
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                    />
                  </View>
                  <View style={styles.showError}>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={[styles.showErrorText]}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.signInText}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      "Change password"
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: "outfit-bold",
    marginVertical: Spacing * 3,
  },
  showError: {
    height: 20,
  },
  showErrorText: {
    fontFamily: "outfit-regular",
    color: "red",
    marginVertical: Spacing * 0.4,
    marginLeft: Spacing * 0.4,
  },
  input: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    padding: Spacing * 2,
    paddingRight: Spacing * 5,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
  },
  signInButton: {
    padding: Spacing * 2,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 1,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  signInText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.onPrimary,
    fontSize: FontSize.medium,
  },
});
