import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "@/constants/Spacing";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loading from "@/components/Loading/Loading";
import { callGetBlogs } from "@/services/api-call";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import ImageWithFallback from "@/components/Image/ImageWithFallback";
import FontSize from "@/constants/FontSize";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  author: string;
  thumbnail: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  totalComments: number;
  categoryBlogName: string;
  categoryBlogId: string;
  createdAt: string;
  updatedAt: string;
}

const BlogList = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [blogData, setBlogData] = useState<BlogData[] | []>([]);

  console.log(blogData);

  const fetchBlogs = async (page = 0) => {
    const pageSize = 8;
    const urlParams = `pageNo=${page}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;

    if (page === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await callGetBlogs(urlParams);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const orders = response.data._embedded?.blogResponseList || [];
      if (orders.length < pageSize) setHasMore(false);

      setBlogData((prev) => (page === 0 ? orders : [...prev, ...orders]));
    } catch (error) {
      console.error("Error fetching order data:", error);
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
      fetchBlogs(nextPage);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <Loading />;
  return (
    <View style={styles.container}>
      <HeaderPage titlePage="Blog" />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ padding: Spacing }}
          data={blogData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listCard,
                styles.dropShadow,
                { padding: Spacing, marginBottom: Spacing },
              ]}
              onPress={() => router.push(`../../(blog)/blogId/${item.id}`)}
            >
              {/* Image */}
              <View
                style={{
                  width: "100%",
                  height: 180,
                  marginBottom: Spacing * 1.6,
                }}
              >
                <ImageWithFallback
                  source={{ uri: item.thumbnail }}
                  fallbackSource={require("../../assets/images/pngegg.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: Spacing * 1.6,
                  }}
                  resizeMode="cover"
                />
              </View>
              {/* Content */}
              <View
                style={[
                  styles.flexStart,
                  {
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    padding: Spacing,
                    borderColor: Colors.gray,
                    borderWidth: 1,
                    borderRadius: Spacing * 0.8,
                    minHeight: 40,
                    minWidth: 90,
                    marginBottom: Spacing,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      fontFamily: "outfit-medium",
                    }}
                  >
                    {item?.categoryBlogName}
                  </Text>
                </TouchableOpacity>
                <View style={{ marginBottom: Spacing }}>
                  <Text
                    style={[
                      styles.title_2_noMargin,
                      { color: Colors.darkText },
                    ]}
                  >
                    {item.totalComments} comments
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.title,
                    {
                      fontSize: FontSize.medium,
                      height: FontSize.medium * 2,
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.flexStart,
                    { gap: Spacing, marginBottom: Spacing },
                  ]}
                >
                  <FontAwesome
                    name="user"
                    size={Spacing * 2}
                    color={Colors.primary}
                    style={{ width: Spacing * 2.4 }}
                  />
                  <Text style={[styles.title_2_noMargin]}>{item.author}</Text>
                </View>
                <View
                  style={[
                    styles.flexStart,
                    { gap: Spacing, marginBottom: Spacing },
                  ]}
                >
                  <AntDesign
                    name="calendar"
                    size={Spacing * 2}
                    color={Colors.primary}
                    style={{ width: Spacing * 2.4 }}
                  />

                  <Text style={[styles.title_2_noMargin]}>
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
export default BlogList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {
    padding: Spacing,
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
});
