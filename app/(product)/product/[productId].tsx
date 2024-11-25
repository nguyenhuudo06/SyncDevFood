import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Carousel from "pinar";
import Spacing from "@/constants/Spacing";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import BackButton from "@/components/Material/BackButton";
import {
  callGetAllDishes,
  callGetDishDetail,
  callProductDetail,
} from "@/services/api-call";
import Checkbox from "expo-checkbox";
import { formatCurrency } from "@/utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";
import { CartItem, doAddProductAction } from "@/redux/orderSlice/orderSlice";

const height = Dimensions.get("window").height;

interface ImageOption {
  imageId: string;
  imageUrl: string;
}

interface DishDetail {
  categoryId: string;
  categoryName: string;
  description: string;
  dishId: string;
  dishName: string;
  images: ImageOption[];
  listOptions: {
    optionGroupId: string;
    optionGroupName: string;
    options: {
      optionSelectionId: string;
      optionName: string;
      additionalPrice: string;
    }[];
  }[];
  longDescription: string;
  offerPrice: number;
  price: number;
  status: string;
  thumbImage: string;
  rating: number;
  slug: string;
  availableQuantity: number;
}

const ProductDetails = () => {
  const route = useRoute();
  const { productId } = route.params;

  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuantity, setCurrentQuantity] = useState<string>("1");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { name: string; price: number; optionSelectionId: string }[];
  }>({});

  // console.log("dishDetail: ", dishDetail);
  // console.log("selectedOptions: ", selectedOptions);

  const dispatch = useDispatch();
  const orderState = useSelector((state: RootState) => state.order);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (numericValue === "") {
      setCurrentQuantity(""); // Giữ giá trị rỗng khi xóa hết
    } else {
      setCurrentQuantity(numericValue); // Đặt giá trị mới khi nhập số
    }
  };

  const handleInputBlur = () => {
    if (currentQuantity == "") setCurrentQuantity("1");
    if (Number(currentQuantity) > dishDetail.availableQuantity)
      setCurrentQuantity(dishDetail.availableQuantity.toString());
  };

  useEffect(() => {
    if (hasAddedToCart) {
      if (orderState.status === "success") {
        Toast.show({
          type: "customToast",
          text1: "Add to cart successfully!",
          onPress: () => Toast.hide(),
          visibilityTime: 1800,
        });
        setHasAddedToCart(false);
        dispatch({ type: "order/resetStatus" });
      } else if (orderState.status === "error" && orderState.error) {
        Toast.show({
          type: "error",
          text1: "Cannot add to cart",
          text2: orderState.error,
          onPress: () => Toast.hide(),
        });
        setHasAddedToCart(false);
        dispatch({ type: "order/resetStatus" });
      }
    }
  }, [orderState.status, orderState.error, hasAddedToCart, dispatch]);

  useEffect(() => {
    const fetchDishDetail = async () => {
      setLoading(true);
      try {
        const allDishesResponse = await callGetAllDishes("");
        const allDishes = allDishesResponse.data._embedded?.dishResponseList;

        const matchingDish = allDishes.find(
          (dish: DishDetail) => dish.dishId === productId
        );
        if (matchingDish) {
          const detailResponse = await callGetDishDetail(matchingDish.dishId);
          setDishDetail(detailResponse.data);
        } else {
          console.error("Dish not found");

          Toast.show({
            type: "error",
            text1: "Dish not found",
            text2: "The requested dish could not be found.",
            onPress: () => Toast.hide(),
          });
          router.replace("../(tabs)/home");
        }
      } catch (error) {
        console.error("Error fetching dish detail:", error);

        Toast.show({
          type: "error",
          text1: "Error loading dish details",
          text2: "Please try again later.",
          onPress: () => Toast.hide(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [productId, route]);

  const handleChangeButton = (type: string) => {
    if (type === "MINUS") {
      if (Number(currentQuantity) > 1) {
        setCurrentQuantity((Number(currentQuantity) - 1).toString());
      }
    }
    if (type === "PLUS") {
      if (
        dishDetail?.availableQuantity &&
        Number(currentQuantity) < dishDetail.availableQuantity
      ) {
        setCurrentQuantity((Number(currentQuantity) + 1).toString());
      } else {
        Toast.show({
          type: "error",
          text1: `Maximum quantity available is ${dishDetail?.availableQuantity}!`,
          text2: "Cannot add more items",
          onPress: () => Toast.hide(),
        });
      }
    }
  };

  const getExistingQuantityInCart = (
    dishId: string,
    selectedOpts: { [key: string]: string }
  ) => {
    return orderState.carts.reduce((total, item) => {
      if (
        item.dishId === dishId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOpts)
      ) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const formatSelectedOptions = (options: typeof selectedOptions) => {
    return Object.entries(options).reduce((acc, [key, value]) => {
      if (value.length > 0) {
        const formattedOpts = value.map(
          (option) =>
            `${option.name} (+ ${option.price.toLocaleString("vi-VN")} VNĐ)`
        );
        acc[key] = formattedOpts.join(", ");
      }
      return acc;
    }, {} as { [key: string]: string });
  };

  const getTotalQuantityInCart = (dishId: string) => {
    return orderState.carts.reduce((total, item) => {
      if (item.dishId === dishId) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const handleOptionChange = (
    groupId: string,
    optionName: string,
    additionalPrice: number,
    isChecked: boolean,
    optionSelectionId: string,
    isRadio?: boolean
  ) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };

      if (isRadio) {
        newOptions[groupId] = [
          {
            name: optionName,
            price: additionalPrice,
            optionSelectionId: optionSelectionId,
          },
        ];
      } else {
        const currentOptions = newOptions[groupId] || [];

        if (!isChecked) {
          // Thêm option vào mảng nếu chưa có
          const updatedOptions = [
            ...currentOptions,
            {
              name: optionName,
              price: additionalPrice,
              optionSelectionId: optionSelectionId,
            },
          ];

          newOptions[groupId] = updatedOptions;
        } else {
          // Xóa option khỏi mảng nếu đã được bỏ chọn
          newOptions[groupId] = currentOptions.filter(
            (option) => option.optionSelectionId !== optionSelectionId
          );

          if (newOptions[groupId].length === 0) {
            delete newOptions[groupId]; // Xóa group nếu không còn lựa chọn nào
          }
        }
      }

      return newOptions;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = dishDetail?.offerPrice ?? 0;

    const optionsPrice = Object.values(selectedOptions).reduce(
      (total, optionGroup) =>
        total +
        optionGroup.reduce(
          (groupTotal, option) => groupTotal + option.price,
          0
        ),
      0
    );

    return (basePrice + optionsPrice) * currentQuantity;
  };

  const handleAddToCart = () => {
    if (dishDetail) {
      const radioGroups = sortedOptions.filter(
        (group) => group.optionGroupName.toLowerCase() === "size"
      );

      const isRadioSelected = radioGroups.every(
        (group) =>
          selectedOptions[group.optionGroupId] &&
          selectedOptions[group.optionGroupId].length > 0
      );

      if (!isRadioSelected) {
        Toast.show({
          type: "error",
          text1: "Please select size before adding to cart!",
          onPress: () => Toast.hide(),
        });
        return;
      }

      const totalQuantityInCart = getTotalQuantityInCart(dishDetail.dishId);
      const newTotalQuantity = totalQuantityInCart + currentQuantity;

      if (newTotalQuantity > dishDetail.availableQuantity) {
        Toast.show({
          type: "error",
          text1: "Cannot add to cart",
          text2: `You have ${totalQuantityInCart} products in your cart. Cannot add ${currentQuantity} more products because it exceeds the available quantity (${dishDetail.availableQuantity}).`,
          onPress: () => Toast.hide(),
        });
        return;
      }

      const formattedOptions = Object.entries(selectedOptions).reduce(
        (acc, [groupId, options]) => {
          const option = options[0];
          acc[groupId] = {
            optionSelectionId: option.optionSelectionId,
            name: option.name,
            price: option.price,
          };
          return acc;
        },
        {} as CartItem["selectedOptions"]
      );

      const cartItem = {
        quantity: currentQuantity,
        dishId: dishDetail.dishId,
        detail: {
          dishName: dishDetail.dishName,
          price: calculateTotalPrice(),
          thumbImage: dishDetail.thumbImage,
        },
        availableQuantity: dishDetail.availableQuantity,
        selectedOptions: formattedOptions,
      };

      dispatch(doAddProductAction(cartItem));
      setHasAddedToCart(true);
    }
  };

  const sortedOptions = useMemo(() => {
    const options = dishDetail?.listOptions || [];
    return [...options].sort((a, b) => {
      if (a.optionGroupName.toLowerCase() === "size") return -1;
      if (b.optionGroupName.toLowerCase() === "size") return 1;
      return 0;
    });
  }, [dishDetail?.listOptions]);
  // console.log("sortedOptions: ", sortedOptions);

  if (loading) {
    return <Text>Loading UI</Text>;
  }

  if (!dishDetail) {
    return null;
  }

  const images = [
    {
      imageId: "thumb",
      imageUrl: dishDetail.thumbImage,
    },
    ...dishDetail.images.map((image) => ({
      imageId: image.imageId,
      imageUrl: image.imageUrl,
    })),
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <BackButton />

      <View style={styles.carouselContainer}>
        <Carousel
          style={styles.carousel}
          showsControls={false}
          dotStyle={styles.dotStyle}
          activeDotStyle={[styles.dotStyle, styles.activeDotStyle]}
        >
          {images?.map((img) => (
            <Image
              style={styles.image}
              source={{
                uri: img.imageUrl,
              }}
              key={img.imageId}
            />
          ))}
        </Carousel>
      </View>

      <View style={{ padding: Spacing }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing,
          }}
        >
          <TouchableOpacity
            style={{
              padding: Spacing,
              borderColor: Colors.gray,
              borderWidth: 1,
              borderRadius: Spacing * 0.8,
              minHeight: 40,
              minWidth: 90,
            }}
          >
            <Text
              style={{ color: Colors.primary, fontFamily: "outfit-medium" }}
            >
              {dishDetail?.categoryName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary_10,
              borderRadius: Spacing * 0.8,
              padding: Spacing,
            }}
          >
            <AntDesign
              name="hearto"
              size={Spacing * 2}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View>
          <View>
            <Text
              style={{
                fontSize: FontSize.large,
                fontFamily: "outfit-medium",
                marginBottom: Spacing,
              }}
            >
              {dishDetail?.dishName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing,
            }}
          >
            <FontAwesome
              name="star-half-empty"
              size={Spacing * 1.6}
              color={Colors.primary}
            />
            <Text
              style={{
                marginHorizontal: Spacing * 0.4,
                fontSize: FontSize.small,
                fontFamily: "outfit-bold",
                color: Colors.gray,
              }}
            >
              {dishDetail?.rating || "No rating"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing,
            }}
          >
            <Text
              style={{
                marginHorizontal: Spacing * 0.4,
                fontSize: FontSize.small,
                fontFamily: "outfit-bold",
              }}
            >
              {formatCurrency(dishDetail?.offerPrice)} VND
            </Text>
            <Text
              style={{
                marginHorizontal: Spacing * 0.4,
                fontSize: FontSize.small,
                fontFamily: "outfit-medium",
                textDecorationLine: "line-through",
                color: Colors.primary,
              }}
            >
              {formatCurrency(dishDetail?.price)} VND
            </Text>
          </View>
          <View>
            <Text
              style={{ fontFamily: "outfit-regular", marginBottom: Spacing }}
            >
              {dishDetail?.description}
            </Text>
          </View>
        </View>

        <View>
          {sortedOptions.map((optionGroup, groupIndex) => (
            <View key={groupIndex}>
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: FontSize.medium,
                }}
              >
                Select{" "}
                {optionGroup.optionGroupName.toLowerCase() === "size"
                  ? "size"
                  : optionGroup.optionGroupName}
                {optionGroup.optionGroupName.toLowerCase() !== "size" && (
                  <Text>(optional)</Text>
                )}
              </Text>
              {optionGroup.options.map((option, optionIndex) => (
                <TouchableOpacity
                  onPress={() =>
                    handleOptionChange(
                      optionGroup.optionGroupId,
                      option.optionName,
                      Number(option.additionalPrice),
                      selectedOptions[optionGroup.optionGroupId]?.find(
                        (obj) =>
                          obj.optionSelectionId === option.optionSelectionId
                      )
                        ? true
                        : false, // Có trong option đang chọn không
                      option.optionSelectionId,
                      optionGroup.optionGroupName.toLowerCase() == "size"
                        ? true
                        : false
                    )
                  }
                  key={optionIndex}
                  id={`${optionGroup.optionGroupName}-${option.optionName}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text>
                      {selectedOptions[optionGroup.optionGroupId] &&
                      selectedOptions[optionGroup.optionGroupId].find(
                        (obj) =>
                          obj.optionSelectionId === option.optionSelectionId
                      ) ? (
                        <FontAwesome
                          name="check-circle-o"
                          size={Spacing * 2}
                          color={Colors.primary}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="checkbox-blank-circle-outline"
                          size={Spacing * 2}
                          color="black"
                        />
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: Spacing * 0.8,
                      marginLeft: Spacing,
                    }}
                  >
                    <Text style={{ fontFamily: "outfit-regular" }}>
                      {option.optionName}
                    </Text>

                    <Text style={{ fontFamily: "outfit-regular" }}>
                      + {Number(option.additionalPrice).toLocaleString()} VND
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: FontSize.medium,
              marginVertical: Spacing,
            }}
          >
            Select Quantity (Available: {dishDetail?.availableQuantity})
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing,
            }}
          >
            <TouchableOpacity
              onPress={() => handleChangeButton("MINUS")}
              style={[
                styles.changeQuantity,
                { backgroundColor: Colors.primary_10 },
              ]}
            >
              <AntDesign
                name="minus"
                size={FontSize.medium}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <TextInput
              maxLength={4}
              onChangeText={handleInputChange}
              onBlur={() => {
                handleInputBlur();
              }}
              keyboardType="numeric"
              numberOfLines={1}
              value={currentQuantity.toString()}
              style={{
                fontFamily: "outfit-medium",
                width: 50,
                paddingHorizontal: Spacing * 0.4,
                textAlign: "center",
              }}
            />
            <TouchableOpacity
              onPress={() => handleChangeButton("PLUS")}
              style={[
                styles.changeQuantity,
                { backgroundColor: Colors.primary },
              ]}
            >
              <AntDesign
                name="plus"
                size={FontSize.medium}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: FontSize.large,
                padding: Spacing * 0.6,
              }}
            >
              {calculateTotalPrice().toLocaleString("vi-VN")} VND
            </Text>
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => handleAddToCart()}
          >
            <Text style={styles.signInText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  carouselContainer: {
    height: (height - 20) / 2.5,
    marginHorizontal: Spacing,
    marginTop: Spacing,
    borderRadius: 20,
    overflow: "hidden",
  },
  carousel: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  dotStyle: {
    width: 30,
    height: 3,
    backgroundColor: "silver",
    marginHorizontal: 3,
    borderRadius: 3,
  },
  activeDotStyle: {
    backgroundColor: "white",
  },
  changeQuantity: {
    width: 26,
    height: 26,
    borderRadius: Spacing * 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    padding: Spacing * 1.6,
    backgroundColor: Colors.primary,
    marginTop: Spacing * 2,
    borderRadius: Spacing,
  },
  signInText: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.white,
    fontSize: FontSize.medium,
  },
});
