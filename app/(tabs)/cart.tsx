import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProductList from "@/components/Product/ProductList";
import BackButton from "@/components/Material/BackButton";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
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
import Coupon from "@/components/Coupon/Coupond";
import { router } from "expo-router";

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

interface AppliedCoupon extends Coupon {
  discountAmount: number;
}

interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
}

const Cart = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state: RootState) => state.order);
  const cartItems = useSelector((state: RootState) => state.order.carts);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [couponCode, setCouponCode] = useState("");
  const userId = useSelector((state: RootState) => state.auth.user_id);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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
        text2: `The total quantity of products in the cart (${totalQuantityInCart}) and the quantity to add (${newQuantity}) exceeds the available quantity (${cartItem.availableQuantity}).`,
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

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <BackButton />
        <View style={styles.spacing}>
          <View>
            <Text style={styles.titlePage}>Cart</Text>
          </View>
          {cartItems.length == 0 && (
            <TouchableOpacity
              onPress={() => router.replace("./home")}
              style={{
                backgroundColor: Colors.primary_10,
                padding: Spacing * 0.4,
                paddingHorizontal: Spacing,
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
                marginBottom: Spacing,
                borderRadius: Spacing * 0.8,
                backgroundColor: Colors.white,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
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
              <View style={{ flex: 1, marginRight: Spacing }}>
                <Text
                  numberOfLines={1}
                  style={{
                    width: "100%",
                    fontFamily: "outfit-medium",
                    fontSize: FontSize.medium,
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
                      // color: Colors.primary,
                    }}
                  >
                    Total: {formatPrice(item.detail.price * item.quantity)} VND
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(
                      item.dishId,
                      item.selectedOptions,
                      item.quantity - 1
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
                <TouchableOpacity>
                  <TextInput
                    maxLength={4}
                    onChangeText={(value) =>
                      handleUpdateQuantity(
                        item.dishId,
                        item.selectedOptions,
                        Number(value)
                      )
                    }
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
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(
                      item.dishId,
                      item.selectedOptions,
                      item.quantity + 1
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
          ))}

          <View
            style={{
              padding: Spacing,
              paddingTop: Spacing * 1.6,
              borderRadius: Spacing * 0.8,
              backgroundColor: Colors.primary,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                padding: Spacing * 0.6,
                borderRadius: 30,
                marginBottom: Spacing * 2,
                flexDirection: "row",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: Spacing,
                  color: Colors.primary,
                  fontFamily: "outfit-medium",
                }}
                placeholder="Coupon code"
              />
              <TouchableOpacity>
                <Text
                  style={{
                    paddingHorizontal: Spacing * 1.5,
                    paddingVertical: Spacing * 0.6,
                    borderRadius: Spacing * 3,
                    backgroundColor: Colors.primary,
                    color: Colors.white,
                    fontFamily: "outfit-medium",
                  }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
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
                Delivery
              </Text>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: FontSize.medium,
                  fontFamily: "outfit-regular",
                }}
              >
                0 VND
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
                {appliedCoupon ? formatPrice(appliedCoupon.discountAmount) : 0}{" "}
                VND
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

          <View
            style={{ marginTop: Spacing, padding: Spacing, marginBottom: 40 }}
          >
            <Coupon couponResponseList={coupons} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
});
