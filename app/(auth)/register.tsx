import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { callRegister } from "@/services/api-call";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: any) => {
    setLoading(true);

    try {
      const response = await callRegister(
        values.email,
        values.password,
        values.fullName
      ); // Đảm bảo fullName

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      Toast.show({
        type: "success",
        text1: "Registration successful!",
        text2: "You can now log in to your account.",
        onPress: () => Toast.hide(),
      });

      setLoading(false);
      // router.replace("./login");
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Registration failed!",
        text2: error.response?.data?.errors.error || "Something went wrong!",
        onPress: () => Toast.hide(),
      });

      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.paddingView}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Create Account</Text>
            <Text style={styles.welcomeText}>
              Create an account so you can explore all the exciting foods
            </Text>
          </View>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleRegister(values);
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
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Full name"
                    placeholderTextColor={Colors.darkText}
                    style={styles.input}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  <View style={styles.showError}>
                    {touched.fullName && errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>

                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={Colors.darkText}
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  <View style={styles.showError}>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={Colors.darkText}
                    secureTextEntry
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <View style={styles.showError}>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.darkText}
                    secureTextEntry
                    style={styles.input}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                  />
                  <View style={styles.showError}>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.signUpText}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      "Sign up"
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.replace("./login")}
                  style={styles.createAccountButton}
                >
                  <Text style={styles.createAccountText}>
                    Already have an account?
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={styles.paddingView}>
            <Text style={styles.continueText}>Or continue with</Text>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons
                  name="logo-google"
                  color={Colors.text}
                  size={Spacing * 2}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome
                  name="facebook"
                  color={Colors.text}
                  size={Spacing * 2}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.replace("../(tabs)/home")}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountText}>Go to home page</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
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
    maxWidth: "60%",
    textAlign: "center",
  },
  inputContainer: {
    marginVertical: Spacing,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  input: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
    marginTop: Spacing,
  },
  signUpButton: {
    padding: Spacing * 2,
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
  signUpText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.onPrimary,
    fontSize: FontSize.large,
  },
  createAccountButton: {
    padding: Spacing,
  },
  createAccountText: {
    fontFamily: "outfit-medium",
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
  showError: {
    height: 20,
  },
});
