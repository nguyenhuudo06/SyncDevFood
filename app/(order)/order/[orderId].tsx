import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import { useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { router, useLocalSearchParams } from "expo-router";
import { callCancelOrderByOrderId } from "@/services/api-call";
import Toast from "react-native-toast-message";
import Loading from "@/components/Loading/Loading";

const OrderId = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const { orderId } = route.params;
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>(
    {}
  ); // Bản đồ lưu trạng thái lỗi từng ảnh

  const params = useLocalSearchParams();

  // Parse dữ liệu orderItems từ params
  const parsedOrderItems = params.orderItems
    ? JSON.parse(params.orderItems)
    : [];
  const parsedOrderDetails = params.orderDetails
    ? JSON.parse(params.orderDetails)
    : {};

  console.log(parsedOrderDetails);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN");

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleCancelOrderByOrderId = async () => {
    setLoading(true);
    try {
      const response = await callCancelOrderByOrderId(
        parsedOrderDetails.orderId || ""
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      Toast.show({
        type: "customToast",
        text1: "Canceled succesfully!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });

      router.push("../../(account)/order");
    } catch (error) {
      console.error("Error fetching order data:", error);

      Toast.show({
        type: "customToast",
        text1: "Failed to cancel!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <HeaderPage titlePage="Order details" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Info */}
        <View style={{ marginBottom: Spacing }}>
          <View style={[styles.flexStart, { marginBottom: Spacing }]}>
            <Text style={[styles.title, { marginRight: Spacing }]}>
              Order code
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.title_2_noMargin}>
                #{parsedOrderDetails.orderId.split("-")[0]}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.flexStart, { marginBottom: Spacing }]}>
            <Text style={[styles.title, { marginRight: Spacing }]}>Status</Text>
            <TouchableOpacity
              style={[
                styles.button,
                parsedOrderDetails.orderStatus === "CANCELED" &&
                  styles.buttonCancel,
              ]}
            >
              <Text
                style={[
                  styles.title_2_noMargin,
                  parsedOrderDetails.orderStatus === "CANCELED" &&
                    styles.title_2_noMarginCancel,
                ]}
              >
                {parsedOrderDetails.orderStatus}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flexStart}>
            <View style={{ marginRight: Spacing }}>
              <Text style={styles.title_2}>Exact location:</Text>
              <Text style={styles.title_2}>Commune:</Text>
              <Text style={styles.title_2}>State:</Text>
              <Text style={styles.title_2}>City:</Text>
              <Text style={styles.title_2}>Phone:</Text>
              <Text style={styles.title_2}>Email:</Text>
              <Text style={styles.title_2}>Order Date:</Text>
            </View>
            <View>
              <Text style={styles.title_2}>
                {parsedOrderDetails.address.district || "..."}
              </Text>
              <Text style={styles.title_2}>
                {parsedOrderDetails.address.commune}
              </Text>
              <Text style={styles.title_2}>
                {parsedOrderDetails.address.state}
              </Text>
              <Text style={styles.title_2}>
                {parsedOrderDetails.address.city}
              </Text>
              <Text style={styles.title_2}>{parsedOrderDetails.userEmail}</Text>
              <Text style={styles.title_2}>{parsedOrderDetails.userEmail}</Text>
              <Text style={styles.title_2}>
                {new Date(parsedOrderDetails.createdAt).toLocaleDateString(
                  "vi-VN"
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Action */}
        <View style={{ marginBottom: Spacing }}>
          {parsedOrderDetails.orderStatus !== "CANCELED" && (
            <View style={styles.flexEnd}>
              <TouchableOpacity onPress={() => handleCancelOrderByOrderId()}>
                <Text
                  style={[
                    styles.button,
                    {
                      backgroundColor: Colors.danger,
                      color: Colors.white,
                      fontFamily: "outfit-bold",
                    },
                  ]}
                >
                  Cancel the order
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Products */}
        <View style={{ marginBottom: Spacing }}>
          {parsedOrderItems.map((product) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`../../(product)/product/${product?.dishId}`)
              }
              key={product.itemId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: Spacing,
                paddingVertical: Spacing * 1.4,
                marginBottom: Spacing,
                borderRadius: Spacing * 0.8,
                backgroundColor: Colors.white,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              {/* Product Image */}
              <View
                style={{
                  borderRadius: Spacing * 0.8,
                  marginRight: Spacing,
                  overflow: "hidden",
                }}
              >
                <Image
                  style={{ width: 62, height: 62 }}
                  source={
                    imageErrorMap[product.itemId]
                      ? require("../../../assets/images/pngegg.png")
                      : { uri: product.thumbImage }
                  }
                  resizeMode="cover"
                  onError={() => handleImageError(product.itemId)}
                />
              </View>

              {/* Product Details */}
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    width: "100%",
                    fontFamily: "outfit-medium",
                    fontSize: FontSize.medium,
                  }}
                >
                  {product.dishName}
                </Text>
                <View>
                  {product.options.map((item) => (
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        color: Colors.dark,
                      }}
                      key={item.optionId}
                    >
                      {item.optionName} {" + "} {item.additionalPrice}
                    </Text>
                  ))}
                </View>
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      width: "100%",
                      fontFamily: "outfit-medium",
                      color: Colors.primary,
                    }}
                  >
                    Price: {formatPrice(product.price)} VND
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      width: "100%",
                      fontFamily: "outfit-medium",
                    }}
                  >
                    Total: {formatPrice(product.totalPrice)} VND
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderId;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {
    padding: Spacing,
  },
  flexStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  flexEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    fontFamily: "outfit-bold",
    marginBottom: Spacing * 0.6,
  },
  title_2: {
    fontFamily: "outfit-medium",
    marginBottom: Spacing * 0.6,
  },
  title_2_noMargin: {
    fontFamily: "outfit-medium",
    marginBottom: 0,
  },
  button: {
    backgroundColor: Colors.primary_20,
    padding: Spacing * 0.6,
    paddingHorizontal: Spacing,
    borderRadius: Spacing * 2,
    width: "auto",
    textAlign: "center",
  },
  buttonCancel: {
    backgroundColor: Colors.danger,
  },
  title_2_noMarginCancel: { color: Colors.white },
  dropShadow: {
    borderRadius: Spacing * 0.8,
    backgroundColor: Colors.white,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});
