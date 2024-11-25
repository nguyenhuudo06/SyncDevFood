import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spacing from "@/constants/Spacing";
import { AntDesign, Entypo } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

const VpnPayment = () => {
  const paymentUrl = useSelector(
    (state: RootState) => state.paymentUrl.paymentUrl
  );
  const [paymentParams, setPaymentParams] = useState(null);

  const handleNavigationChange = (event) => {
    const { url } = event;

    // Kiểm tra nếu URL trả về chứa thông tin kết quả thanh toán
    if (url.includes("/payment/return")) {
      // Thay bằng URL callback bạn cấu hình
      // Phân tích URL để lấy tham số
      const queryParams = new URLSearchParams(url.split("?")[1]);
      const transactionStatus = queryParams.get("vnp_TransactionStatus"); // Ví dụ: trạng thái giao dịch
      const transactionId = queryParams.get("vnp_TxnRef"); // Ví dụ: mã giao dịch

      // Lưu thông tin hoặc xử lý logic theo nhu cầu
      setPaymentParams({
        status: transactionStatus,
        transactionId: transactionId,
      });

      // Ngăn không cho WebView tiếp tục tải URL
      return false;
    }

    // Cho phép WebView tiếp tục tải trang nếu không phải callback URL
    return true;
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {paymentParams ? (
          <View style={styles.scrollView}>
            {paymentParams?.status != "00" ? (
              <View
                style={[
                  styles.padding_10,
                  {
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    marginBottom: Spacing * 2,
                    fontSize: FontSize.xLarge
                  }}
                >
                  VnPay failed!
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: Spacing,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push("../(tabs)/home")}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        fontSize: FontSize.small,
                        backgroundColor: Colors.primary,
                        color: Colors.white,
                        padding: Spacing,
                        borderRadius: Spacing * 1.8,
                      }}
                    >
                      By More Dishes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push("../(account)/order")}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        fontSize: FontSize.small,
                        backgroundColor: Colors.primary,
                        color: Colors.white,
                        padding: Spacing,
                        borderRadius: Spacing * 1.8,
                      }}
                    >
                      View Orders
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.padding_10, { alignItems: "center" }]}>
                <View style={{ marginVertical: Spacing * 2 }}>
                  <AntDesign
                    name="checkcircle"
                    size={Spacing * 6}
                    color="green"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: FontSize.large,
                    marginBottom: Spacing,
                  }}
                >
                  Order Placed Successfully!
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.primary_10,
                    padding: Spacing * 2,
                    borderRadius: Spacing * 0.8,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="mail"
                    size={Spacing * 2}
                    color={Colors.primary}
                  />
                  <Text
                    style={{
                      fontFamily: "outfit-regular",
                      fontSize: FontSize.medium,
                      textAlign: "center",
                    }}
                  >
                    We have sent the order confirmation to your email. Please
                    check your inbox for order details.
                  </Text>
                </View>
                <View style={{ marginVertical: Spacing * 2 }}>
                  <Text
                    style={{
                      fontFamily: "outfit-medium",
                      fontSize: FontSize.small,
                    }}
                  >
                    Transaction Status:{" "}
                    <Text
                      style={{
                        fontFamily: "outfit-regular",
                        fontSize: FontSize.small,
                      }}
                    >
                      {paymentParams.status == "00"
                        ? "Success"
                        : "Payment failed"}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-medium",
                      fontSize: FontSize.small,
                    }}
                  >
                    Transaction ID:{" "}
                    <Text
                      style={{
                        fontFamily: "outfit-regular",
                        fontSize: FontSize.small,
                      }}
                    >
                      {paymentParams.transactionId}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: Spacing,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push("../(tabs)/home")}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        fontSize: FontSize.small,
                        backgroundColor: Colors.primary,
                        color: Colors.white,
                        padding: Spacing,
                        borderRadius: Spacing * 1.8,
                      }}
                    >
                      By More Dishes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push("../(account)/order")}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        fontSize: FontSize.small,
                        backgroundColor: Colors.primary,
                        color: Colors.white,
                        padding: Spacing,
                        borderRadius: Spacing * 1.8,
                      }}
                    >
                      View Orders
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <WebView
            source={{ uri: paymentUrl }}
            javaScriptEnabled={true}
            onShouldStartLoadWithRequest={(request) =>
              handleNavigationChange(request)
            }
          />
        )}
      </View>
    </>
  );
};

export default VpnPayment;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
    flex: 1,
  },
  padding_10: {
    padding: Spacing,
  },
});
