import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { callGetReviewsByDishId } from "@/services/api-call";
import Spacing from "@/constants/Spacing";
import StarRating from "./Rating";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import ImageWithFallback from "../Image/ImageWithFallback";
import Toast from "react-native-toast-message";

interface Comment {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  dishName: string;
  userId: string;
  userFullName: string;
  userAvatar: string;
  replies: any[];
  createdAt: string;
}

const Comment = ({ dishId }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [orderData, setOrderData] = useState<Comment[] | []>([]);

  const fetchOrders = async (page = 0) => {
    const pageSize = 10;
    const urlParams = `pageNo=${page}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;

    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await callGetReviewsByDishId(dishId || "", urlParams);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const comments = response.data._embedded?.reviewResponseList || [];
      if (comments.length < pageSize) setHasMore(false);

      setOrderData((prev) => (page === 0 ? comments : [...prev, ...comments]));

      console.log(orderData);
    } catch (error) {
      console.error("Error fetching order data:", error);
      Toast.show({
        type: "customToast",
        text1: "Sothing wrong!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
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
  }, []);

  if (loading) return <Loading />;

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={orderData}
        keyExtractor={(item) => item.reviewId}
        renderItem={({ item }) => (
          <View style={[styles.flexStart]}>
            <View>
              <ImageWithFallback
                source={{ uri: item.userAvatar }}
                fallbackSource={require("../../assets/images/pngegg.png")}
                style={{
                  width: Spacing * 4.5,
                  height: Spacing * 4.5,
                  borderRadius: Spacing * 3,
                  marginRight: Spacing,
                  borderWidth: 1,
                  borderColor: Colors.gray,
                }}
                resizeMode="cover"
              />
            </View>
            <View
              style={{flex: 1, padding: Spacing }}
            >
              <Text style={[styles.commentName]}>{item.userFullName}</Text>
              <StarRating
                styleCus={{ paddingVertical: Spacing * 0.6 }}
                rating={item.rating}
              />
              <Text style={[styles.commentContent]}>{item.comment}</Text>
              <Text
                style={[
                  styles.commentContent,
                  { color: Colors.primary, fontFamily: "outfit-bold" },
                ]}
              >
                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={{ padding: Spacing, marginBottom: Spacing }}
              size="small"
              color="#0000ff"
            />
          ) : null
        }
      />
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  flexStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  commentName: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
  },
  commentContent: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    marginBottom: Spacing * 0.6,
    flexWrap: "wrap",
  },
});
