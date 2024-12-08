import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomModal, ModalTitle, ModalContent } from "react-native-modals";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { AntDesign, EvilIcons, Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { callGetAllCouponNotUsedByUserId } from "@/services/api-call";
import {
  CartItem,
  doRemoveProductAction,
  doUpdateQuantityAction,
  SelectedOption,
} from "@/redux/orderSlice/orderSlice";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import { setCoupon } from "@/redux/couponSlice/couponSlice";

interface Coupon {
  couponId: string;
  couponCode: string;
  description: string;
  status: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  availableQuantity: number;
  startDate: string;
  expirationDate: string;
}

const Cart2 = () => {
  const [showCoupondModal, setShowCoupondModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.order.carts);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // console.log("coupons: ", coupons);

  const fetchCoupons = async () => {
    try {
      const query = `userId=${userId}&sortBy=startDate&sortDir=desc`;
      const response = await callGetAllCouponNotUsedByUserId(query);
      const couponsData = response.data._embedded.couponResponseList;
      setCoupons(couponsData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleRemoveItem = (
    dishId: string,
    selectedOptions: CartItem["selectedOptions"]
  ) => {
    dispatch(doRemoveProductAction({ dishId, selectedOptions }));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  const renderOptionValue = (
    value: string | SelectedOption | SelectedOption[]
  ): React.ReactNode => {
    if (typeof value === "string") {
      if (value.includes("(+")) {
        // Split the string into individual options
        const options = value.split(",").map((option) => option.trim());
        return (
          <>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                {option}
                {index < options.length - 1 && <br />}
              </React.Fragment>
            ))}
          </>
        );
      }
      return value;
    }
    if (Array.isArray(value)) {
      return (
        <>
          {value.map((option, index) => (
            <React.Fragment key={index}>
              {option.name} (+{formatPrice(option.price)} VNĐ)
              {index < value.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }
    return `${value.name} (+${formatPrice(value.price)} VNĐ)`;
  };

  const handleUpdateQuantity = (
    dishId: string,
    selectedOptions: CartItem["selectedOptions"],
    newQuantity: number
  ) => {
    newQuantity = newQuantity < 1 ? 1 : newQuantity;

    const cartItem = cartItems.find(
      (item) =>
        item.dishId === dishId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (!cartItem) return;

    const totalQuantityInCart = cartItems.reduce((total, item) => {
      if (item.dishId === dishId) {
        return (
          total +
          (item.dishId === cartItem.dishId &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(cartItem.selectedOptions)
            ? 0
            : item.quantity)
        );
      }
      return total;
    }, 0);

    if (totalQuantityInCart + newQuantity > cartItem.availableQuantity) {
      Toast.show({
        type: "error",
        text1: "Cannot update quantity",
        text2: `No available quantity!`,
        onPress: () => Toast.hide(),
      });
      return;
    }

    dispatch(
      doUpdateQuantityAction({
        dishId,
        selectedOptions,
        quantity: newQuantity,
      })
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.detail.price * item.quantity,
      0
    );
  };

  const calculateDiscount = (subtotal: number, appliedCoupon) => {
    const couponFound = coupons.find(
      (coupon) => coupon.couponId === appliedCoupon
    );
    if (couponFound == undefined) return 0;

    if (subtotal < couponFound.minOrderValue) return 0;

    const discountAmount = subtotal * (couponFound.discountPercent / 100);

    const finalDiscount =
      discountAmount > couponFound.maxDiscount
        ? couponFound.maxDiscount
        : discountAmount;
    return finalDiscount;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal, appliedCoupon);
  // console.log("subtotal: ", subtotal);
  // console.log("discount: ", discount);

  const calculateTotal = () => {
    return subtotal - discount;
  };

  const handleCheckout = () => {
    if (cartItems.length == 0) {
      Toast.show({
        type: "customToast",
        text1: "No dish available!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
      return;
    }
    router.push("../(task)/checkout");
  };

  const setReduxCoupon = async (coupon) => {
    console.log(coupon);

    dispatch(
      setCoupon({
        couponCode: coupon.couponCode,
        couponId: coupon.couponId,
        discountPercent: coupon.discountPercent,
        maxDiscount: coupon.maxDiscount,
        minOrderValue: coupon.minOrderValue,
      })
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <HeaderPage titlePage="Cart" />

      <View style={styles.spacing}>
        {cartItems.length == 0 && (
          <>
            <TouchableOpacity
              onPress={() => router.replace("./home")}
              style={{
                backgroundColor: Colors.primary_10,
                padding: Spacing * 0.4,
                paddingHorizontal: Spacing,
                paddingVertical: Spacing,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: Spacing * 0.8,
                marginBottom: Spacing,
              }}
            >
              <AntDesign
                name="plus"
                size={FontSize.small}
                color={Colors.primary}
              />
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  marginLeft: Spacing * 0.8,
                }}
              >
                Add some dish
              </Text>
            </TouchableOpacity>
          </>
        )}

        {cartItems.map((item) => (
          <View
            key={`${item.dishId}-${JSON.stringify(item.selectedOptions)}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: Spacing,
              paddingVertical: Spacing * 1.4,
              paddingBottom: Spacing * 0.5,
              marginBottom: Spacing,
              borderRadius: Spacing * 0.8,
              backgroundColor: Colors.white,
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
              overflow: "hidden",
            }}
          >
            {/* Absolute delete button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                console.log("hhhh");
                handleRemoveItem(item.dishId, item.selectedOptions);
              }}
              style={[styles.absoluteDeleleIcon]}
            >
              <Feather
                name="x-circle"
                size={Spacing * 2}
                color={Colors.primary}
              />
            </TouchableOpacity>

            {/* Image */}
            <View
              style={{
                borderRadius: Spacing * 0.8,
                marginRight: Spacing,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ width: 62, height: 62 }}
                source={{
                  uri: item.detail.thumbImage,
                }}
                resizeMode="cover"
              />
            </View>

            {/* Content */}
            <View
              style={{
                flex: 1,
              }}
            >
              {/* Left */}
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    width: "100%",
                    fontFamily: "outfit-medium",
                    fontSize: FontSize.medium,
                    paddingRight: Spacing * 3
                  }}
                >
                  {item.detail.dishName}
                </Text>
                <View>
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <Text
                      style={{
                        fontFamily: "outfit-medium",
                        color: Colors.gray,
                      }}
                      key={key}
                    >
                      {renderOptionValue(value)}
                    </Text>
                  ))}
                </View>
                <View style={{}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      width: "100%",
                      fontFamily: "outfit-medium",
                      color: Colors.primary,
                    }}
                  >
                    Price: {formatPrice(item.detail.price)} VND
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      width: "100%",
                      fontFamily: "outfit-medium",
                    }}
                  >
                    Total: {formatPrice(item.detail.price * item.quantity)} VND
                  </Text>
                </View>
              </View>
              {/* Right */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateQuantity(
                        item.dishId,
                        item.selectedOptions,
                        Number(item.quantity) - 1
                      )
                    }
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
                  <View>
                    <TextInput
                      maxLength={4}
                      onChangeText={(value) =>
                        handleUpdateQuantity(
                          item.dishId,
                          item.selectedOptions,
                          Number(value)
                        )
                      }
                      onBlur={() => {
                        // handleInputBlur();
                      }}
                      keyboardType="numeric"
                      numberOfLines={1}
                      value={String(item.quantity)}
                      style={{
                        fontFamily: "outfit-medium",
                        width: 50,
                        paddingHorizontal: Spacing * 0.4,
                        textAlign: "center",
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateQuantity(
                        item.dishId,
                        item.selectedOptions,
                        Number(item.quantity) + 1
                      )
                    }
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
              </View>
            </View>
          </View>
        ))}

        {/* {cartItems.length > 0 && (
          <TouchableOpacity
            onPress={async () => {
              if (!isAuthenticated) {
                router.push("../(auth)/login");
                return;
              }
              await setShowCoupondModal((prev) => !prev);
            }}
            style={[
              styles.dropShadow,

              { padding: Spacing, marginBottom: Spacing, overflow: "hidden" },
            ]}
          >
            <View>
              <Text
                style={{ textAlign: "center", fontFamily: "outfit-medium" }}
              >
                Select coupond
              </Text>
            </View>
          </TouchableOpacity>
        )} */}

        {/* Modal information */}
        <View
          style={{
            padding: Spacing,
            paddingTop: Spacing * 1.6,
            borderRadius: Spacing * 0.8,
            backgroundColor: Colors.primary,
            marginBottom: Spacing * 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: Spacing * 0.4,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-medium",
              }}
            >
              Sub-Total
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-regular",
              }}
            >
              {formatPrice(calculateSubtotal())} VND
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: Spacing * 0.4,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-medium",
              }}
            >
              Discount
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-regular",
              }}
            >
              {formatPrice(discount)} VND
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: Spacing * 0.4,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-bold",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSize.medium,
                fontFamily: "outfit-bold",
              }}
            >
              {formatPrice(calculateTotal())} VND
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => handleCheckout()}
          >
            <Text style={styles.signInText}>Check out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomModal
        visible={showCoupondModal}
        onTouchOutside={() => setShowCoupondModal(false)}
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.8}
        width={1}
        onSwipeOut={() => setShowCoupondModal(false)}
      >
        <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {coupons.length > 0 ? (
              coupons.map((item) => (
                <View
                  key={item.couponId}
                  style={[
                    {
                      padding: Spacing * 0.4,
                      marginBottom: Spacing,
                    },
                  ]}
                >
                  <TouchableOpacity
                    // disabled={true}
                    onPress={async () => {
                      await setAppliedCoupon(item.couponId || null);
                      await setShowCoupondModal(false);
                      await setReduxCoupon(item);
                    }}
                    style={[
                      styles.dropShadow,
                      { padding: Spacing, overflow: "hidden" },
                    ]}
                  >
                    {appliedCoupon == item.couponId && (
                      <View style={styles.triangle} />
                    )}
                    <Text
                      style={[
                        styles.couponContent,
                        {
                          fontFamily: "outfit-bold",
                          fontSize: FontSize.medium,
                        },
                      ]}
                    >
                      #{item.couponCode}{" "}
                      <Text style={[styles.couponQuantity]}>
                        X {item.availableQuantity}
                      </Text>
                    </Text>
                    <Text style={[styles.couponContent]}>
                      Sale up to {item.discountPercent}% off (Max{" "}
                      {item.maxDiscount}) VNĐ
                    </Text>
                    <Text style={[styles.couponContent]}>
                      Applicable for minimum order {item.minOrderValue} VNĐ
                    </Text>
                    <Text style={[styles.couponContent]}>
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("vi-VN")
                        : "N/A"}{" "}
                      -{" "}
                      {item.expirationDate
                        ? new Date(item.expirationDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No coupond available</Text>
            )}
          </ScrollView>
        </ModalContent>
      </BottomModal>
    </ScrollView>
  );
};

export default Cart2;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: Spacing * 2, // Chiều rộng của cạnh vuông
    borderTopWidth: Spacing * 2, // Chiều cao của cạnh vuông
    borderLeftColor: "transparent", // Giấu phần bên trái của tam giác
    borderTopColor: "blue", // Màu của phần cạnh vuông
    borderRightWidth: 0,
    borderBottomWidth: 0,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  couponContent: {
    fontFamily: "outfit-medium",
  },
  couponQuantity: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  dropShadow: {
    borderRadius: Spacing * 0.8,
    backgroundColor: Colors.white,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  titlePage: {
    fontSize: FontSize.xLarge,
    fontFamily: "outfit-bold",
    marginBottom: Spacing,
  },
  spacing: {
    padding: Spacing,
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
    backgroundColor: Colors.white,
    marginTop: Spacing * 2,
    borderRadius: Spacing,
    shadowColor: Colors.white,
  },
  signInText: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.primary,
    fontSize: FontSize.medium,
  },
  absoluteDeleleIcon: {
    position: "absolute",
    top: Spacing * 0.4,
    right: Spacing * 0.4,
    padding: Spacing * 0.4,
    zIndex: 10,
  },
});
