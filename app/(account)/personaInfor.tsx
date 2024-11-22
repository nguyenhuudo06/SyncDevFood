import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import {
  callGetOrderById,
  callProfile,
  callUpdateProfile,
} from "@/services/api-call";
import { login } from "@/redux/authSlice/authSlice";
import { RootState } from "@/redux/store";
import HeaderPage from "@/components/HeaderPage/HeaderPage";

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const MyTabView = () => {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.auth);
  const [isVisibleEditInfo, setIsVisibleEditInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpdatePersonalInfor = async (values) => {
    setLoading(true);

    try {
      const responseUpdateProfile = await callUpdateProfile(
        values.fullName,
        values.email
      );

      if (
        responseUpdateProfile.status < 200 ||
        responseUpdateProfile.status >= 300
      ) {
        throw new Error(
          "Request failed with status " + responseUpdateProfile.status
        );
      }

      const responseProfile = await callProfile();

      if (responseProfile.status < 200 || responseProfile.status >= 300) {
        throw new Error("Request failed with status " + responseProfile.status);
      }

      dispatch(login(responseProfile.data));

      Toast.show({
        type: "success",
        text1: "Updated successful!",
        text2: "You have updated your infomation.",
        onPress: () => Toast.hide(),
      });

      setLoading(false);
      router.back();
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Updated failed!",
        text2: error.response?.data?.errors.error || "Somthing wrong!",
        onPress: () => Toast.hide(),
      });

      setLoading(false);
    }
  };

  const userId = useSelector((state: RootState) => state.auth.user_id);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await callGetOrderById(
          userId || "",
          "pageNo=0&pageSize=100&sortBy=createdAt&sortDir=desc"
        );
        const orders = response.data._embedded.orderResponseList;

        const stats = orders.reduce(
          (acc: any, order: any) => {
            acc.total++;
            if (order.orderStatus === "COMPLETED") {
              acc.completed++;
            } else if (
              order.orderStatus === "CANCELLED" ||
              order.orderStatus === "CANCELED"
            ) {
              acc.cancelled++;
            }
            return acc;
          },
          { total: 0, completed: 0, cancelled: 0 }
        );

        setOrderStats(stats);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HeaderPage titlePage="Personal Infor" />
        <View style={{ padding: Spacing }}>
          <View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "start",
                gap: Spacing * 3,
                alignItems: "center",
                padding: Spacing * 2,
                marginBottom: Spacing,
                borderRadius: Spacing,
                backgroundColor: "#faf6f3fa",
              }}
            >
              <View>
                <Entypo
                  name="shopping-cart"
                  size={Spacing * 2.4}
                  color="#FFA500"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                    color: "#FFA500",
                  }}
                >
                  Total Order
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                  }}
                >
                  ({orderStats.total})
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "start",
                gap: Spacing * 3,
                alignItems: "center",
                padding: Spacing * 2,
                marginBottom: Spacing,
                borderRadius: Spacing,
                backgroundColor: "#faf6f3fa",
              }}
            >
              <View>
                <Entypo
                  name="shopping-cart"
                  size={Spacing * 2.4}
                  color="#FFA500"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                    color: "#FFA500",
                  }}
                >
                  Completed
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                  }}
                >
                  ({orderStats.completed})
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "start",
                gap: Spacing * 3,
                alignItems: "center",
                padding: Spacing * 2,
                marginBottom: Spacing,
                borderRadius: Spacing,
                backgroundColor: "#faf6f3fa",
              }}
            >
              <View>
                <Entypo
                  name="shopping-cart"
                  size={Spacing * 2.4}
                  color="#FFA500"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                    color: "#FFA500",
                  }}
                >
                  Cancel
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.medium,
                  }}
                >
                  ({orderStats.cancelled})
                </Text>
              </View>
            </View>
          </View>
          {isVisibleEditInfo ? (
            <View
              style={{
                width: "100%",
                padding: Spacing * 2,
                marginBottom: Spacing,
                borderRadius: Spacing,
                backgroundColor: "#faf6f3fa",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: Spacing,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: FontSize.medium,
                      marginBottom: Spacing,
                    }}
                  >
                    Personal Information
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#ffa500",
                    padding: Spacing * 0.6,
                    borderRadius: Spacing * 0.6,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      gap: Spacing * 0.4,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setIsVisibleEditInfo(false);
                    }}
                  >
                    <MaterialIcons
                      name="cancel"
                      size={Spacing * 2}
                      color="white"
                    />
                    <Text style={{ color: "white" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Formik
                  initialValues={{
                    fullName: userData.user_name || "",
                    email: userData.email || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    handleUpdatePersonalInfor(values);
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
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder="Full name"
                        onChangeText={handleChange("fullName")}
                        onBlur={handleBlur("fullName")}
                        value={values.fullName}
                      />
                      <View style={styles.showError}>
                        {touched.fullName && errors.fullName && (
                          <Text
                            style={{
                              color: "red",
                              fontFamily: "outfit-medium",
                              fontSize: FontSize.small,
                            }}
                          >
                            {errors.fullName}
                          </Text>
                        )}
                      </View>

                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                      />
                      <View style={styles.showError}>
                        {touched.email && errors.email && (
                          <Text
                            style={{
                              color: "red",
                              fontFamily: "outfit-medium",
                              fontSize: FontSize.small,
                            }}
                          >
                            {errors.email}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => handleSubmit()}
                      >
                        <Text style={styles.signInText}>
                          Update information
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                padding: Spacing * 2,
                marginBottom: Spacing,
                borderRadius: Spacing,
                backgroundColor: "#faf6f3fa",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: Spacing,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: FontSize.medium,
                      marginBottom: Spacing,
                    }}
                  >
                    Personal Information
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#66BB6A",
                    padding: Spacing * 0.6,
                    borderRadius: Spacing * 0.6,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      gap: Spacing * 0.4,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setIsVisibleEditInfo(true);
                    }}
                  >
                    <MaterialIcons
                      name="edit-note"
                      size={Spacing * 2}
                      color="white"
                    />
                    <Text style={{ color: "white" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "outfit-medium",
                    fontSize: FontSize.small,
                    lineHeight: FontSize.small * 1.6,
                  }}
                >
                  Name:{" "}
                  <Text style={{ fontFamily: "outfit-regular" }}>
                    nguyenhuudo
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit-medium",
                    fontSize: FontSize.small,
                    lineHeight: FontSize.small * 1.6,
                  }}
                >
                  Email:{" "}
                  <Text style={{ fontFamily: "outfit-regular" }}>
                    nguyenhuudo@gmail.com
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  input: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    padding: Spacing * 2,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
  },
  signInButton: {
    padding: Spacing,
    backgroundColor: Colors.primary,
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
    fontSize: FontSize.small,
  },
  showError: {
    height: 20,
    marginBottom: Spacing,
  },
});

export default MyTabView;
