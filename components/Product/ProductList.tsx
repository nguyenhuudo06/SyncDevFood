import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import { formatCurrency } from "@/utils/currency";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { callAllProduct } from "@/services/api-call";

const { width } = Dimensions.get("window");

const colWidths = {
  1: "100%",
  2: "50%",
  3: "33.33%",
  4: "25%",
};

const useColumnSize = () => {
  const { width } = Dimensions.get("window");

  if (width <= 360) {
    return 1;
  } else if (width <= 768) {
    return 2;
  } else {
    return 4;
  }
};

const CustomLayoutContainer = ({ children, style }) => {
  return (
    <View style={[styles["custom-layout-container"], style]}>{children}</View>
  );
};

const CustomLayoutRow = ({ children, style }) => {
  return <View style={[styles["custom-layout-row"], style]}>{children}</View>;
};

const CustomLayoutCol = ({ children, size, style }) => {
  return (
    <View
      style={[
        styles["custom-layout-col"],
        {
          flexBasis: colWidths[size] || colWidths[1],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const ProductList = () => {
  const columnSize = useColumnSize();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleGetProductLists = async (page: number) => {
    setLoading(true);

    try {
      const responseGetProductLists = await callAllProduct(page);

      if (
        responseGetProductLists.status < 200 ||
        responseGetProductLists.status >= 300
      ) {
        throw new Error(
          "Request failed with status " + responseGetProductLists.status
        );
      }

      setProductList((prev) => [
        ...prev,
        ...responseGetProductLists?.data?._embedded?.dishResponseList,
      ]);
      if (
        responseGetProductLists?.data?.page?.number <
        responseGetProductLists?.data?.page?.totalPages - 1
      )
        setHasMore(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProductLists(pageNumber);
  }, [pageNumber]);

  const loadMoreFc = () => {
    // if (hasMore && !loading) {
    //   setPageNumber((prevPage) => prevPage + 1);
    // }
    console.log("Run flat list");
  };

  return (
    <CustomLayoutContainer style={{}}>
      <CustomLayoutRow style={{ marginBottom: Spacing }}>
        <FlatList
          data={productList}
          numColumns={columnSize}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <CustomLayoutCol key={item.dishId} size={columnSize} style={styles}>
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  router.push(`../(product)/product/${item?.dishId}`)
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: Spacing * 0.4,
                    marginBottom: Spacing * 0.8,
                  }}
                >
                  <Entypo name="star" size={FontSize.medium} color="orange" />
                  <Text
                    style={{
                      fontSize: FontSize.xsmall,
                      lineHeight: FontSize.xsmall * 1.2,
                      fontFamily: "outfit-bold",
                    }}
                  >
                    {item?.rating ?? "No ratings"}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: Spacing,
                    marginBottom: Spacing,
                  }}
                >
                  <Image
                    source={{ uri: item?.thumbImage }}
                    resizeMode="cover"
                    style={{ width: "100%", height: 80 }}
                  />
                </View>
                <View style={{}}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: "outfit-medium",
                      fontSize: FontSize.medium,
                      lineHeight: FontSize.medium * 1.2,
                      minHeight: 2 * (FontSize.medium * 1.2),
                    }}
                  >
                    {item?.dishName}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: "outfit-bold",
                      color: Colors.description,
                      opacity: 0.5,
                      fontSize: FontSize.xsmall,
                      // lineHeight: FontSize.xsmall * 1.2,
                      // minHeight: 2 * (FontSize.xsmall * 1.2),
                    }}
                  >
                    {item?.categoryName}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-bold",
                        color: Colors.orange,
                        fontSize: FontSize.small,
                      }}
                    >
                      VND
                    </Text>
                    <View>
                      <AntDesign
                        name="pluscircle"
                        size={30}
                        color={Colors.orange}
                      />
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        width: "100%",
                        fontFamily: "outfit-bold",
                        color: Colors.orange,
                        fontSize: FontSize.small,
                        paddingTop: Spacing * 0.4,
                      }}
                    >
                      {formatCurrency(100000000.99)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </CustomLayoutCol>
          )}
          keyExtractor={(item) => item.dishId.toString()}
          onEndReached={loadMoreFc}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={{ padding: Spacing, alignItems: "center" }}>
              <Text style={{ fontFamily: "outfit-medium", color: Colors.gray }}>
                End of List
              </Text>
              {loading && <ActivityIndicator size="large" color="#00ff00" />}
            </View>
          )}
        />
      </CustomLayoutRow>
    </CustomLayoutContainer>
  );
};

const styles = StyleSheet.create({
  "custom-layout-container": {
    width: "100%",
    marginBottom: 80,
    maxHeight: Dimensions.get("window").height,
    padding: Spacing,
  },
  "custom-layout-row": {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginHorizontal: -(Spacing / 2),
  },
  "custom-layout-col": {
    paddingHorizontal: Spacing / 2,
    marginBottom: Spacing,
  },
  item: {
    paddingHorizontal: Spacing * 1.2,
    paddingVertical: Spacing * 0.8,
    borderRadius: Spacing,
    backgroundColor: Colors.white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: Colors.text,
  },
});

export default ProductList;
