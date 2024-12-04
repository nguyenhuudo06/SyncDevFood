import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
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
  callAddDishToWishList,
  callGetAllDishes,
  callGetDishDetail,
} from "@/services/api-call";
import { formatCurrency } from "@/utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";
import { CartItem, doAddProductAction } from "@/redux/orderSlice/orderSlice";
import { BottomModal, ModalContent } from "react-native-modals";
import WebView from "react-native-webview";
import Comment from "@/components/Comment/Comment";
import Loading from "@/components/Loading/Loading";
import RatingChoose from "@/components/Comment/RatingChoose";

const height = Dimensions.get("window").height;

interface ImageOption {
  imageId: string;
  imageUrl: string;
}

export interface DishDetail {
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
  const [bottomModal, setBottomModal] = useState({
    description: false,
    reviews: false,
  });

  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuantity, setCurrentQuantity] = useState<string>("1");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { name: string; price: number; optionSelectionId: string }[];
  }>({});

  const userId = useSelector((state: RootState) => state.auth.user_id);

  const modifiedHtml = `
  <html>
    <head>
      <style>
        body {
          font-size: 40px;
          line-height: 1.6;
          font-family: outfit-regular;
          margin: 0;
          padding: 0;
          overflow-y: scroll;
          height: 100%;
        }
      </style>
    </head>
    <body>
      ${dishDetail?.longDescription}
    </body>
  </html>
`;

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
          type: "customToast",
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
            type: "customToast",
            text1: "Dish not found",
            onPress: () => Toast.hide(),
          });
          router.replace("../(tabs)/home");
        }
      } catch (error) {
        console.error("Error fetching dish detail:", error);

        Toast.show({
          type: "customToast",
          text1: "Error loading dish details",
          onPress: () => Toast.hide(),
        });
        router.back();
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
          type: "customToast",
          text1: `Quantity available is ${dishDetail?.availableQuantity}!`,
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
          type: "customToast",
          text1: "Please select size before adding to cart!",
          onPress: () => Toast.hide(),
        });
        return;
      }

      const totalQuantityInCart = getTotalQuantityInCart(dishDetail.dishId);
      const newTotalQuantity =
        Number(totalQuantityInCart) + Number(currentQuantity);

      if (newTotalQuantity > dishDetail.availableQuantity) {
        Toast.show({
          type: "customToast",
          text1: "Cannot add to cart",
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
        quantity: Number(currentQuantity),
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

  const addDishToWishList = async () => {
    try {
      const response = await callAddDishToWishList(dishDetail?.dishId, userId);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      Toast.show({
        type: "customToast",
        text1: "Add to wishlist successfully!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    } catch (error) {
      console.error("Add wishlist error: ", error);
      if (!userId) {
        Toast.show({
          type: "customToast",
          text1: "Please login first!",
          onPress: () => Toast.hide(),
          visibilityTime: 1800,
        });
      } else {
        Toast.show({
          type: "customToast",
          text1: "Failed to add wishlist",
          onPress: () => Toast.hide(),
          visibilityTime: 1800,
        });
      }
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

  if (loading) {
    return <Loading />;
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
    <ScrollView style={styles.scrollView}>
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
              style={styles.carouselImage}
              source={{ uri: img.imageUrl }}
              key={img.imageId}
            />
          ))}
        </Carousel>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>
              {dishDetail?.categoryName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => addDishToWishList()}
          >
            <AntDesign
              name="hearto"
              size={Spacing * 2}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.dishName}>{dishDetail?.dishName}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={Spacing * 2} color={Colors.orange} />
            <Text style={styles.ratingText}>
              {dishDetail?.rating || "No rating"}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              {formatCurrency(dishDetail?.offerPrice)} VND
            </Text>
            <Text style={styles.originalPrice}>
              {formatCurrency(dishDetail?.price)} VND
            </Text>
          </View>

          <Text style={styles.description}>{dishDetail?.description}</Text>
        </View>

        {sortedOptions.map((optionGroup, groupIndex) => (
          <View key={groupIndex}>
            <Text style={styles.optionGroupTitle}>
              Select{" "}
              {optionGroup.optionGroupName.toLowerCase() === "size"
                ? "size"
                : optionGroup.optionGroupName}
              {optionGroup.optionGroupName.toLowerCase() !== "size" && (
                <Text style={styles.optionalText}>(optional)</Text>
              )}
            </Text>
            {optionGroup.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                onPress={() =>
                  handleOptionChange(
                    optionGroup.optionGroupId,
                    option.optionName,
                    Number(option.additionalPrice),
                    !!selectedOptions[optionGroup.optionGroupId]?.find(
                      (obj) =>
                        obj.optionSelectionId === option.optionSelectionId
                    ),
                    option.optionSelectionId,
                    optionGroup.optionGroupName.toLowerCase() === "size"
                  )
                }
                style={styles.optionContainer}
              >
                <View>
                  {selectedOptions[optionGroup.optionGroupId]?.some(
                    (obj) => obj.optionSelectionId === option.optionSelectionId
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
                </View>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionName}>{option.optionName}</Text>
                  <Text style={styles.optionPrice}>
                    + {Number(option.additionalPrice).toLocaleString()} VND
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View>
          <Text style={styles.quantityTitle}>
            Select Quantity (Available: {dishDetail?.availableQuantity})
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleChangeButton("MINUS")}
              style={[styles.changeQuantity, styles.quantityMinus]}
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
              onBlur={handleInputBlur}
              keyboardType="numeric"
              value={currentQuantity.toString()}
              style={styles.quantityInput}
            />
            <TouchableOpacity
              onPress={() => handleChangeButton("PLUS")}
              style={[styles.changeQuantity, styles.quantityPlus]}
            >
              <AntDesign
                name="plus"
                size={FontSize.medium}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPrice}>
            {calculateTotalPrice().toLocaleString("vi-VN")} VND
          </Text>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.flexBetween,
            {
              backgroundColor: Colors.backgroundBox,
              padding: Spacing,
              borderRadius: Spacing * 0.8,
              marginBottom: Spacing,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.contentModalButton]}
            onPress={() =>
              // setBottomModal((prevState) => ({
              //   ...prevState,
              //   description: true,
              // }))
              router.push(`../productDescription/${dishDetail.dishId}`)
            }
          >
            <Text style={[styles.contentModalButtonContent]}>Description</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={[styles.contentModalButton]}
            onPress={() =>
              // setBottomModal((prevState) => ({
              //   ...prevState,
              //   reviews: true,
              // }))
              router.push(`../productComment/${dishDetail.dishId}`)
            }
          >
            <Text style={[styles.contentModalButtonContent]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Comment */}
        <View style={[styles.commentForm]}>
          <View>
            <RatingChoose dishId={dishDetail.dishId} />
          </View>
        </View>
      </View>

      {/* Description */}
      <BottomModal
        visible={bottomModal.description}
        onTouchOutside={() =>
          setBottomModal((prevState) => ({
            ...prevState,
            description: false,
          }))
        }
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.8}
        width={1}
        onSwipeOut={() =>
          setBottomModal((prevState) => ({
            ...prevState,
            description: false,
          }))
        }
      >
        <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
          <View style={styles.bottomModalContent}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: modifiedHtml }}
              style={{ width: "100%" }}
            />
          </View>
        </ModalContent>
      </BottomModal>

      {/* Reviews */}
      <BottomModal
        visible={bottomModal.reviews}
        onTouchOutside={() =>
          setBottomModal((prevState) => ({
            ...prevState,
            reviews: false,
          }))
        }
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.8}
        width={1}
        onSwipeOut={() =>
          setBottomModal((prevState) => ({
            ...prevState,
            reviews: false,
          }))
        }
      >
        <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
          <View style={styles.bottomModalContent}>
            <Comment dishId={productId} />
          </View>
        </ModalContent>
      </BottomModal>
    </ScrollView>
  );
};

export default ProductDetails;

const shared = StyleSheet.create({
  button: {
    padding: Spacing,
    borderRadius: Spacing * 0.8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
  },
  text: {
    fontFamily: "outfit-regular",
  },
});

const styles = StyleSheet.create({
  commentForm: {
    paddingVertical: Spacing,
  },
  bottomModalContent: { flex: 1 },
  contentModalButton: {
    flex: 1,
    justifyContent: "center",
  },
  contentModalButtonContent: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    color: Colors.primary,
  },
  divider: { height: "100%", width: 1, backgroundColor: Colors.gray },

  // ScrollView styles
  scrollView: { backgroundColor: "#fff", flex: 1 },

  // Carousel styles
  carouselContainer: {
    height: (height - 20) / 2.5,
    marginHorizontal: Spacing,
    marginTop: Spacing,
    borderRadius: 20,
    overflow: "hidden",
  },
  carousel: { width: "100%", height: "100%" },
  carouselImage: { width: "100%", height: "100%", borderRadius: 20 },
  dotStyle: {
    width: 30,
    height: 3,
    backgroundColor: "silver",
    marginHorizontal: 3,
    borderRadius: 3,
  },
  activeDotStyle: { backgroundColor: "white" },

  // Content container styles
  contentContainer: { padding: Spacing },

  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing,
  },
  categoryButton: {
    ...shared.button,
    borderColor: Colors.gray,
    borderWidth: 1,
  },
  categoryButtonText: {
    color: Colors.primary,
    fontFamily: "outfit-medium",
  },
  favoriteButton: {
    backgroundColor: Colors.primary_10,
    borderRadius: Spacing * 0.8,
    padding: Spacing,
  },

  // Dish details styles
  dishName: {
    fontSize: FontSize.large,
    fontFamily: "outfit-medium",
    marginBottom: Spacing,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing,
  },
  ratingText: {
    marginHorizontal: Spacing * 0.4,
    fontSize: FontSize.small,
    fontFamily: "outfit-bold",
    color: Colors.gray,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing,
  },
  currentPrice: {
    marginHorizontal: Spacing * 0.4,
    fontSize: FontSize.small,
    fontFamily: "outfit-bold",
  },
  originalPrice: {
    marginHorizontal: Spacing * 0.4,
    fontSize: FontSize.small,
    fontFamily: "outfit-medium",
    textDecorationLine: "line-through",
    color: Colors.primary,
  },
  description: { fontFamily: "outfit-regular", marginBottom: Spacing },

  // Options styles
  optionGroupTitle: {
    fontFamily: "outfit-medium",
    fontSize: FontSize.medium,
    marginVertical: Spacing,
  },
  optionalText: {
    fontFamily: "outfit-regular",
    color: Colors.gray,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing * 0.8,
    marginLeft: Spacing,
  },
  optionName: { fontFamily: "outfit-regular" },
  optionPrice: { fontFamily: "outfit-regular" },

  // Quantity styles
  quantityTitle: {
    fontFamily: "outfit-medium",
    fontSize: FontSize.medium,
    marginVertical: Spacing,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing,
  },
  changeQuantity: {
    width: 26,
    height: 26,
    borderRadius: Spacing * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityMinus: { backgroundColor: Colors.primary_10 },
  quantityPlus: { backgroundColor: Colors.primary },
  quantityInput: {
    fontFamily: "outfit-medium",
    width: 50,
    paddingHorizontal: Spacing * 0.4,
    textAlign: "center",
  },

  // Total price and Add to Cart button
  totalPrice: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.large,
    padding: Spacing * 0.6,
  },
  addToCartButton: {
    padding: Spacing * 1.6,
    backgroundColor: Colors.primary,
    marginTop: Spacing * 2,
    borderRadius: Spacing,
    marginBottom: Spacing,
  },
  addToCartText: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.white,
    fontSize: FontSize.medium,
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
