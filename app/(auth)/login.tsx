import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native";
import { router } from "expo-router";

import { Formik } from "formik";
import * as Yup from "yup";
import { callLogin, callProfile } from "@/services/api-call";
import Toast from "react-native-toast-message";
import { setAccessToken } from "@/utils/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/authSlice/authSlice";
import { Entypo } from "@expo/vector-icons";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password is at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      const responseLogin = await callLogin(email, password);

      if (responseLogin.status < 200 || responseLogin.status >= 300) {
        throw new Error("Request failed with status " + responseLogin.status);
      }

      setAccessToken(responseLogin.data.accessToken);

      const responseProfile = await callProfile();

      if (responseProfile.status < 200 || responseProfile.status >= 300) {
        throw new Error("Request failed with status " + responseProfile.status);
      }

      dispatch(login(responseProfile.data));

      Toast.show({
        type: "customToast",
        text1: "Login successful!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });

      setLoading(false);

      router.replace("../(tabs)/home");
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "customToast",
        text1: "Login failed!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });

      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.paddingView}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Syndev Food</Text>
            <Text style={styles.welcomeText}>
              Welcome back you've been missed!
            </Text>
          </View>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleLogin(values.email, values.password);
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
                <View>
                  <View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        numberOfLines={1}
                        placeholder="Email"
                        placeholderTextColor={Colors.darkText}
                        style={styles.input}
                        onChangeText={(text) =>
                          handleChange("email")(text.trim())
                        }
                        onBlur={handleBlur("email")}
                        value={values.email}
                      />
                      <View style={styles.showError}>
                        {touched.email && errors.email && (
                          <Text style={[styles.errorText]}>{errors.email}</Text>
                        )}
                      </View>

                      <View style={{ marginTop: Spacing }}>
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: 0,
                            transform: [{ translateY: -(Spacing * 2) }],
                            marginRight: Spacing,
                            zIndex: 10,
                          }}
                        >
                          {showPassword ? (
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
                          numberOfLines={1}
                          placeholder="Password"
                          placeholderTextColor={Colors.darkText}
                          secureTextEntry={!showPassword}
                          style={styles.input}
                          onChangeText={(text) =>
                            handleChange("password")(text.trim())
                          }
                          onBlur={handleBlur("password")}
                          value={values.password}
                        />
                      </View>
                      <View style={styles.showError}>
                        {touched.password && errors.password && (
                          <Text style={[styles.errorText]}>
                            {errors.password}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => router.push("./forgotPassword")}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.signInText}>
                    {loading ? (
                      <ActivityIndicator
                        size={Spacing * 1.6}
                        color={Colors.white}
                      />
                    ) : (
                      "Sign in"
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.replace("./register")}
              style={styles.createAccountButton}
            >
              <Text
                style={[styles.createAccountText, { color: Colors.primary }]}
              >
                Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("../(tabs)/home")}
              style={styles.createAccountButton}
            >
              <Text
                style={[styles.createAccountText, { color: Colors.primary }]}
              >
                Home page
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  paddingView: {
    padding: Spacing * 2,
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
  welcomeText: {
    fontFamily: "outfit-medium",
    fontSize: FontSize.large,
    maxWidth: "90%",
    textAlign: "center",
  },
  showError: {
    height: Spacing * 2.6,
  },
  inputContainer: {
    marginVertical: Spacing * 3,
  },
  input: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    padding: Spacing * 2,
    paddingRight: Spacing * 5,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
  },
  forgotPasswordText: {
    fontFamily: "outfit-regular",
    color: Colors.primary,
    fontSize: FontSize.small,
    alignSelf: "flex-end",
  },
  signInButton: {
    padding: Spacing * 2,
    height: 68,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 3,
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
  createAccountButton: {
    padding: Spacing,
  },
  createAccountText: {
    fontFamily: "outfit-regular",
    textAlign: "center",
    color: Colors.text,
    fontSize: FontSize.small,
  },
  continueText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.primary,
    fontSize: FontSize.small,
  },
  socialButtonsContainer: {
    marginTop: Spacing,
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
    borderRadius: Spacing / 2,
    marginHorizontal: Spacing,
  },
  errorText: {
    color: Colors.danger,
    marginTop: 5,
    fontFamily: "outfit-regular",
  },
});
