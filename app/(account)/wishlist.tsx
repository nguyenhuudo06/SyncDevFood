import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Spacing from "@/constants/Spacing";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  callDeleteDishFromWishList,
  callGetWishListById,
} from "@/services/api-call";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [wishList, setWishList] = useState([]);
  const userId = useSelector((state: RootState) => state.auth.user_id);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>(
    {}
  ); // Bản đồ lưu trạng thái lỗi từng ảnh

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const wishListConvert = wishList?.flatMap((item) =>
    item?.dishes?.map((dish) => ({
      wishlistId: item.wishlistId,
      dishId: dish.dishId,
      dishName: dish.dishName,
      offerPrice: dish.offerPrice,
      thumbImage: dish.thumbImage,
      price: dish.price,
      rating: dish.rating,
    }))
  );

  const fetchData = async (page = 0) => {
    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    if (!hasMore || loading) return;

    try {
      const response = await callGetWishListById(userId || "");
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const orders = response.data._embedded?.wishlistResponseList || [];
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

  // const handleDeleteWishList = async (dishId: string) => {
  //   try {
  //     const response = await callDeleteDishFromWishList(dishId, userId);

  //     if (response.status < 200 || response.status >= 300) {
  //       throw new Error("Request failed with status " + response.status);
  //     }

  //     Toast.show({
  //       type: "customToast",
  //       text1: "Removed successfully!",
  //       onPress: () => Toast.hide(),
  //       visibilityTime: 1800,
  //     });

  //     fetchData(0);
  //   } catch (error) {
  //     console.error("Remove error: ", error);
  //     Toast.show({
  //       type: "customToast",
  //       text1: "Failed remove!",
  //       onPress: () => Toast.hide(),
  //       visibilityTime: 1800,
  //     });
  //   }
  // };

  const handleDeleteWishList = async (dishId: string) => {
    try {
      const response = await callDeleteDishFromWishList(dishId, userId);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      // Cập nhật danh sách wishList
      setWishList((prev) =>
        prev.filter((item) =>
          item.dishes.some((dish) => dish.dishId !== dishId)
        )
      );

      Toast.show({
        type: "customToast",
        text1: "Removed successfully!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    } catch (error) {
      console.error("Remove error: ", error);
      Toast.show({
        type: "customToast",
        text1: "Failed remove!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
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
      <HeaderPage titlePage="Wishlist" />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ padding: Spacing }}
          data={wishListConvert}
          keyExtractor={(item) => item.wishlistId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listCard, styles.dropShadow]}
              onPress={() => {
                router.push(`../(product)/product/${item?.dishId}`);
              }}
            >
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteWishList(item.dishId);
                }}
                style={[styles.absoluteDeleleIcon]}
              >
                <Feather
                  name="x-circle"
                  size={Spacing * 2}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <View style={styles.flexStart}>
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
                      imageErrorMap[item.wishlistId]
                        ? require("../../assets/images/pngegg.png")
                        : { uri: item.thumbImage }
                    }
                    resizeMode="cover"
                    onError={() => handleImageError(item.wishlistId)}
                  />
                </View>
                <View style={{ marginRight: Spacing * 4 }}>
                  <Text style={styles.title}>{item.dishName}</Text>
                  <Text style={styles.title_2}>Price: {item.price}</Text>
                  <Text style={styles.title_2}>
                    Rating: {item.rating || "No Rating"}
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
});

export default Wishlist;
