import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Spacing from "@/constants/Spacing";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ProductList from "@/components/Product/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  callAllDishToSearch,
  callAllProduct,
  callGetAllCategories,
} from "@/services/api-call";
import { addDish, Dish } from "@/redux/productSlice/productSlice";
import FontSize from "@/constants/FontSize";
import { formatCurrency } from "@/utils/currency";
import ImageWithFallback from "@/components/Image/ImageWithFallback";
import { Dropdown as DropdownLib } from "react-native-element-dropdown";
import { BottomModal, ModalTitle, ModalContent } from "react-native-modals";
import StarRating from "@/components/Comment/RatingSortType";

const filterType = [
  { label: "A - Z", value: "ascName" },
  { label: "Z - A", value: "descName" },
  { label: "Price low to high", value: "ascPrice" },
  { label: "Price high to low", value: "descPrice" },
];

const Search = () => {
  const dispatch = useDispatch();
  const [range, setRange] = useState([20, 80]);
  const [searchText, setSearchText] = useState("");
  // const products = useSelector((state: RootState) => state.dishes);
  const [products, setProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ascName");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [categoryType, setCategoryType] = useState([
    { label: "All", value: "all" },
  ]);

  const fetchAllCategories = async () => {
    try {
      const response = await callGetAllCategories();

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const categories = response.data?._embedded?.categoryResponseList || [];

      const newCategories = categories.map((item) => {
        return { label: item.name, value: item.name };
      });

      setCategoryType((prev) => [...prev, ...newCategories]);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  // const fetchAllProducts = async () => {
  //   try {
  //     const response = await callAllDishToSearch();

  //     if (response.status < 200 || response.status >= 300) {
  //       throw new Error("Request failed with status " + response.status);
  //     }

  //     const products = response.data || [];

  //     dispatch(addDish(products));
  //   } catch (error) {
  //     console.error("Error fetching order data:", error);
  //   }
  // };

  const fetchAllProducts = async (page = 0, accumulatedProducts = []) => {
    // console.log("Fetch data");
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

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  const filteredProducts = products
    .filter((product) =>
      product.dishName.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((product) => {
      if (selectedCategory !== "all") {
        return product.categoryNames === selectedCategory;
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedFilter === "ascName") {
        return a.dishName.localeCompare(b.dishName);
      } else if (selectedFilter === "descName") {
        return b.dishName.localeCompare(a.dishName);
      } else if (selectedFilter === "descPrice") {
        return b.price - a.price;
      } else if (selectedFilter === "ascPrice") {
        return a.price - b.price;
      }
      return 0;
    });

  const handleFilterChange = (item) => {
    setSelectedFilter(item.value);
  };

  const handleCategoryChange = (item) => {
    setSelectedCategory(item.value);
  };

  useEffect(() => {
    fetchAllProducts();
    fetchAllCategories();
  }, []);

  const renderItem = (item) => {
    return <Text style={styles.dropdownItem}>{item.label}</Text>;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View
          style={[
            styles.searchWrapper,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: Spacing,
            },
          ]}
        >
          <TouchableOpacity style={{ flex: 1 }}>
            <LinearGradient
              colors={[Colors.primary_20, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchBar}
            >
              <Ionicons name="search" size={24} color={Colors.text} />
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: Spacing * 1.2 }}
            onPress={() => setShowFilterModal((prev) => !prev)}
          >
            <FontAwesome
              name="filter"
              size={Spacing * 2}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

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
          {/* <FlatList
          data={filteredProducts}
          numColumns={2}
          nestedScrollEnabled
          keyExtractor={(item) => item.dishId}
          renderItem={({ item }) => (
            <View style={{ width: "50%", padding: Spacing }}>
              <TouchableOpacity
                style={[styles.dropShadow]}
                onPress={() =>
                  router.push(`../(product)/product/${item?.dishId}`)
                }
              >
                <View style={[styles.dishBox]}>
                  <View style={{ marginBottom: Spacing }}>
                    <ImageWithFallback
                      source={{ uri: item?.thumbImage }}
                      fallbackSource={require("../../assets/images/pngegg.png")}
                      style={{
                        width: "100%",
                        height: Spacing * 10,
                        borderRadius: Spacing * 0.8,
                        marginRight: Spacing,
                        borderWidth: 1,
                        borderColor: Colors.gray,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.dishBoxTitle,
                      {
                        fontSize: FontSize.medium,
                        lineHeight: FontSize.medium * 1.2,
                        minHeight: FontSize.medium * 3,
                      },
                    ]}
                  >
                    {item.dishName}
                  </Text>
                  <Text
                    style={[
                      styles.dishBoxContent,
                      {
                        textDecorationLine: "line-through",
                        color: Colors.gray,
                      },
                    ]}
                  >
                    {formatPrice(item.price)} VND
                  </Text>
                  <Text style={[styles.dishBoxContent]}>
                    Today: {formatPrice(item.offerPrice)} VND
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        /> */}

          {filteredProducts.map((item) => (
            <View
              key={item?.dishId}
              style={{ flexBasis: "50%", padding: Spacing * 0.5 }}
            >
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
                  <AntDesign
                    name="star"
                    size={FontSize.medium}
                    color={Colors.orange}
                  />
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
                      minHeight: 2 * (FontSize.medium * 1.6),
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

        <BottomModal
          visible={showFilterModal}
          onTouchOutside={() => setShowFilterModal(false)}
          overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
          height={0.5}
          width={1}
          onSwipeOut={() => setShowFilterModal(false)}
        >
          <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
            <View>
              <View>
                <Text style={[styles.titleDropdownFilter]}>Sort by:</Text>
                <DropdownLib
                  style={[styles.dropdown, { width: "100%", height: 50 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={filterType}
                  labelField="label"
                  valueField="value"
                  placeholder={""}
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  renderItem={renderItem}
                />
                <Text style={[styles.titleDropdownFilter]}>
                  Filter category:
                </Text>
                <DropdownLib
                  style={[styles.dropdown, { width: "100%", height: 50 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={categoryType}
                  labelField="label"
                  valueField="value"
                  placeholder={""}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  renderItem={renderItem}
                />
              </View>
            </View>
          </ModalContent>
        </BottomModal>
      </View>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
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
  titleDropdownFilter: {
    fontFamily: "outfit-medium",
    marginBottom: Spacing,
  },
  dropdownItem: {
    fontSize: 16,
    color: "black",
    fontFamily: "outfit-regular",
    padding: Spacing * 1.6,
  },
  dropdown: {
    height: Spacing * 2.8,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    fontFamily: "outfit-regular",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
    fontFamily: "outfit-regular",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "outfit-regular",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchWrapper: {
    padding: Spacing,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing * 0.4,
    paddingLeft: Spacing * 1.6,
    marginVertical: Spacing,
    borderRadius: Spacing,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "outfit-regular",
    flex: 1,
    color: Colors.text,
    paddingLeft: 10,
    borderWidth: 0,
  },
  dropShadow: {
    borderRadius: Spacing * 0.8,
    backgroundColor: Colors.white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  dishBox: {
    padding: Spacing,
    borderRadius: Spacing * 0.8,
    overflow: "hidden",
  },
  dishBoxTitle: {
    fontFamily: "outfit-medium",
    marginBottom: Spacing * 0.6,
  },
  dishBoxContent: {
    fontFamily: "outfit-bold",
    marginBottom: Spacing * 0.6,
    color: Colors.primary,
  },
});
