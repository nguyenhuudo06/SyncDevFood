import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Loading from "@/components/Loading/Loading";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import { RootState } from "@/redux/store";
import { callGetOrderById } from "@/services/api-call";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

interface Option {
  optionId: string;
  optionName: string;
  additionalPrice: number;
}

interface OrderItem {
  itemId: string;
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  thumbImage: string;
  options: Option[];
}

interface Address {
  id: string;
  street: string;
  commune: string;
  district: string | null;
  city: string;
  country: string;
  postalCode: number;
  state: string;
  addressType: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  orderId: string;
  userId: string;
  userEmail: string;
  orderStatus: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  address: Address;
  orderItems: OrderItem[];
}

const statusColor = {
  PENDING: Colors.primary,
  ACCEPTED: "#1890ff",
  PROCESSING: "#722ed1",
  SHIPPING: "#52c41a",
  COMPLETED: "#52c41a",
  CANCELED: Colors.danger,
};

const Order = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [orderData, setOrderData] = useState<OrderResponse[] | []>([]);
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const fetchOrders = async (page = 0) => {
    const pageSize = 6;
    const urlParams = `pageNo=${page}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;

    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await callGetOrderById(userId || "", urlParams);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const orders = response.data._embedded?.orderResponseList || [];
      if (orders.length < pageSize) setHasMore(false);

      setOrderData((prev) => (page === 0 ? orders : [...prev, ...orders]));
    } catch (error) {
      console.error("Error fetching order data:", error);
      // Toast.show({
      //   type: "customToast",
      //   text1: "Something wrong!",
      //   onPress: () => Toast.hide(),
      //   visibilityTime: 1800,
      // });
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1 }}>
      <HeaderPage titlePage="Order" />
      <View style={{ padding: Spacing, flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={orderData}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listCard}>
              {/* Order Id */}
              <View style={{ marginBottom: Spacing * 0.6 }}>
                <Text style={styles.listCardTitle} numberOfLines={1}>
                  Order Id:
                  <Text style={styles.listCardTitleFollow}>{item.orderId}</Text>
                </Text>
              </View>

              {/* Order date */}
              <View style={{ marginBottom: Spacing * 0.6 }}>
                <Text style={styles.listCardTitle} numberOfLines={1}>
                  Order date:
                  <Text style={styles.listCardTitleFollow}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </Text>
              </View>

              {/* Order date */}
              <View style={{ marginBottom: Spacing * 0.6 }}>
                <View style={styles.flexStart}>
                  <Text style={styles.listCardTitle}>Status:</Text>
                  <Text
                    style={[
                      styles.listCardStatus,
                      { backgroundColor: statusColor[item.orderStatus] },
                    ]}
                  >
                    {item.orderStatus}
                  </Text>
                </View>
              </View>

              {/* Order date */}
              <View>
                <Text style={styles.listCardTitle} numberOfLines={1}>
                  Total:
                  <Text
                    style={[
                      styles.listCardTitleFollow,
                      { color: Colors.active },
                    ]}
                  >
                    {item.totalPrice.toLocaleString()} VND
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: Colors.primary_10,
    padding: Spacing,
    paddingHorizontal: Spacing,
    borderRadius: Spacing * 0.8,
    marginBottom: Spacing,
  },
  flexStart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listCardTitle: { fontFamily: "outfit-medium", fontSize: FontSize.medium },
  listCardTitleFollow: {
    fontFamily: "outfit-regular",
    color: Colors.dark,
    marginLeft: Spacing,
  },
  listCardStatus: {
    fontFamily: "outfit-regular",
    fontSize: 12,
    color: Colors.white,
    marginLeft: Spacing,
    paddingHorizontal: Spacing * 0.8,
    paddingVertical: Spacing * 0.2,
    borderRadius: Spacing * 0.8,
  },
});
