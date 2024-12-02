import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Spacing from "@/constants/Spacing";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  callDeleteDishFromWishList,
  callGetReviewsByUserId,
  callGetWishListById,
} from "@/services/api-call";
import Colors from "@/constants/Colors";
import StarRating from "@/components/Comment/Rating";
import ImageWithFallback from "@/components/Image/ImageWithFallback";
import FontSize from "@/constants/FontSize";
import { router } from "expo-router";

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [wishList, setWishList] = useState([]);
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const fetchData = async (page = 0) => {
    const pageSize = 6;
    const urlParams = `pageNo=${page}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;

    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    if (!hasMore || loading) return;

    try {
      const response = await callGetReviewsByUserId(userId || "", urlParams);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const orders = response.data._embedded?.reviewResponseList || [];
      const totalPage = response.data.page.totalPages;

      // Ngừng tải thêm nếu không còn dữ liệu hoặc dữ liệu ít hơn `pageSize`
      setHasMore(page >= Number(totalPage) - 1 ? false : true);

      // Gộp dữ liệu nếu có nhiều trang
      setWishList((prev) => (page === 0 ? orders : [...prev, ...orders]));
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <View style={styles.content}>
      <HeaderPage titlePage="Reviews" />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ padding: Spacing }}
          data={wishList}
          keyExtractor={(item) => item.reviewId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listCard, styles.dropShadow]}
              onPress={() => {
                router.push(`../(product)/product/${item?.dishId}`);
              }}
            >
              <View style={[styles.flexStart]}>
                <View style={{ marginRight: Spacing }}>
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
                <View>
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
            </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
  },
  listCard: {
    backgroundColor: Colors.white,
    padding: Spacing,
    paddingHorizontal: Spacing,
    borderRadius: Spacing * 0.8,
    marginBottom: Spacing,
    overflow: "hidden"
  },
  dropShadow: {
    borderRadius: Spacing * 0.8,
    backgroundColor: Colors.white,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  flexStart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  flexEnd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  absoluteDeleleIcon: {
    position: "absolute",
    top: Spacing,
    right: Spacing,
    padding: Spacing * 0.4,
    zIndex: 10,
  },
  title: {
    fontFamily: "outfit-bold",
    marginBottom: Spacing * 0.6,
  },
  title_2: {
    fontFamily: "outfit-medium",
    marginBottom: Spacing * 0.6,
  },
  commentName: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
  },
  commentContent: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.small,
    marginBottom: Spacing * 0.6,
    flexWrap: "wrap", // Đảm bảo văn bản ngắt dòng
    lineHeight: FontSize.small * 1.5, // Cải thiện khoảng cách dòng
    width: "100%",
  },
});

export default Reviews;
