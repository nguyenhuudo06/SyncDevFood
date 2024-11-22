import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { setAccessToken } from "@/utils/axios-instance";
import Toast from "react-native-toast-message";
import { callForgotPassword } from "@/services/api-call";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string) => {
    setLoading(true);

    try {
      const responseForgotPassword = await callForgotPassword(email);

      if (responseForgotPassword.status < 200 || responseForgotPassword.status >= 300) {
        throw new Error("Request failed with status " + responseForgotPassword.status);
      }

      Toast.show({
        type: "success",
        text1: "Successful!",
        text2: "Check your email to change the password!",
        onPress: () => Toast.hide(),
      });

      setLoading(false);

      // router.replace("../(tabs)/home");
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Login failed!",
        text2: error.response?.data?.errors.error || "Something wrong!",
        onPress: () => Toast.hide(),
      });

      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.paddingView}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Welcome back!</Text>
            <Text style={styles.welcomeText}>
              Enter your email to change the password
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                handleLogin(values.email);
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
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.buttonText}>
                      Send verify email
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={() => router.replace("./login")}>
              <Text style={styles.navText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("./register")}>
              <Text style={styles.navText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
  formContainer: {
    marginVertical: Spacing * 3,
  },
  inputContainer: {
    marginVertical: Spacing * 3,
  },
  input: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
    marginTop: Spacing,
  },
  showError: {
    height: 20,
  },
  errorText: {
    color: "red",
  },
  sendButton: {
    padding: Spacing * 2,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 3,
    marginTop: Spacing,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.onPrimary,
    fontSize: FontSize.large,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },
  navText: {
    fontFamily: "outfit-regular",
    color: Colors.primary,
    fontSize: FontSize.small,
  },
});
