import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import { formatCurrency } from "@/utils/currency";
import { router } from "expo-router";
import { callAllProduct } from "@/services/api-call";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async (page = 0, accumulatedProducts = []) => {
    console.log("Fetch data");
    try {
      const response = await callAllProduct(page);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const data = response.data;
      const newProducts = data?._embedded?.dishResponseList || [];
      const allProducts = [...accumulatedProducts, ...newProducts];

      // Kiểm tra xem còn bản ghi ở các trang tiếp theo không
      if (page + 1 < data.page.totalPages) {
        // Gọi lại chính nó với trang tiếp theo
        await fetchAllProducts(page + 1, allProducts);
      } else {
        // Nếu không còn trang nào, cập nhật state
        setProducts(allProducts);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: Spacing * 2,
        marginBottom: Spacing * 8,
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginHorizontal: -Spacing,
      }}
    >
      {products.map((item) => (
        <View
          key={item?.dishId}
          style={{ flexBasis: "50%", padding: Spacing * 0.5 }}
        >
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`../(product)/product/${item?.dishId}`)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing * 0.4,
                marginBottom: Spacing * 0.8,
              }}
            >
              <AntDesign name="star" size={FontSize.medium} color={Colors.orange}/>
              <Text
                style={{
                  fontSize: FontSize.xsmall,
                  lineHeight: FontSize.xsmall * 1.2,
                  fontFamily: "outfit-bold",
                }}
              >
                {item?.rating?.toFixed(2) ?? "No ratings"}
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
                style={{ width: "100%", height: 120 }}
              />
            </View>
            <View style={{}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: FontSize.medium,
                  lineHeight: FontSize.medium * 1.2,
                  minHeight: 2 * (FontSize.medium * 1.4),
                }}
              >
                {item?.dishName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "outfit-bold",
                  color: Colors.description,
                  opacity: 0.5,
                  fontSize: FontSize.xsmall,
                  lineHeight: FontSize.xsmall * 1.2,
                }}
              >
                {item?.categoryName}
              </Text>
              <View
                style={{
                  position: "absolute",
                  top: Spacing * 5,
                  right: 0,
                }}
              >
                <View>
                  <AntDesign
                    name="pluscircle"
                    size={30}
                    color={Colors.primary}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    width: "100%",
                    fontFamily: "outfit-bold",
                    color: Colors.primary,
                    fontSize: FontSize.small,
                    paddingTop: Spacing * 0.4,
                  }}
                >
                  {formatCurrency(item.price)} VND
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
