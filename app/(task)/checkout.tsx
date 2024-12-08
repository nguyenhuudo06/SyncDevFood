import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFocusEffect } from "@react-navigation/native";
import {
  callAddress,
  callCreateOrder,
  callGeocoding,
  callProcessPayment,
} from "@/services/api-call";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import Checkbox from "expo-checkbox";
import FontSize from "@/constants/FontSize";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { doClearCartAction } from "@/redux/orderSlice/orderSlice";
import { setPaymentUrl } from "@/redux/paymentUrlSlice/paymentUrlSlice";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import { BottomModal, ModalTitle, ModalContent } from "react-native-modals";
import { resetCoupon } from "@/redux/couponSlice/couponSlice";

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

interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  postalCode: number;
  state: string;
  addressType: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
  commune: string;
  district: string;
}

interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  appliedCoupon: {
    couponId: string;
    couponCode: string;
    discountAmount: number;
  } | null;
}

interface DeliveryResponse {
  from: string;
  to: string;
  distance: string;
  fee: string;
  duration: string;
}

interface Item {
  dishId: string;
  quantity: number;
  dishOptionSelectionIds?: string[];
}

export interface OrderInformation {
  addressId: string | null;
  couponId: string | null;
  items: Item[] | [];
  note: string | null;
  paymentMethod: "COD" | "BANKING";
  shippingFee: number;
  userId: string | null;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user_id);
  const userName = useSelector((state: RootState) => state.auth.user_name);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const cartItems = useSelector((state: RootState) => state.order.carts);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANKING">("COD");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [bottomModalAndTitle, setBottomModalAndTitle] = useState(false);

  const reduxCoupon = useSelector((state: RootState) => state.coupon);

  const selectedAddressUi = addresses.find(
    (item) => item.id === selectedAddress
  );

  const checkoutItems = cartItems.map((cart) => ({
    dishId: cart.dishId,
    quantity: cart.quantity,
    dishOptionSelectionIds: Object.values(cart.selectedOptions).map(
      (option) => option.optionSelectionId
    ),
  }));

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    delivery: 0,
    discount: 0,
    total: 0,
    appliedCoupon: null,
  });

  const orderInformation: OrderInformation = {
    addressId: selectedAddress,
    couponId: reduxCoupon?.couponId || null,
    items: checkoutItems ?? [],
    note: "",
    paymentMethod: paymentMethod,
    shippingFee: orderSummary.delivery,
    userId: userId,
  };

  const [geocodingCaculater, setGeocodingCaculater] = useState({
    distance: 0,
    duration: "0 m",
  });

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.detail.price * item.quantity,
      0
    );
  };

  const calculateDiscount = (subtotal: number, reduxCoupon) => {
    if (subtotal < reduxCoupon.minOrderValue) return 0;

    const discountAmount = subtotal * (reduxCoupon.discountPercent / 100);

    const finalDiscount =
      discountAmount > reduxCoupon.maxDiscount
        ? reduxCoupon.maxDiscount
        : discountAmount;
    return finalDiscount;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal, reduxCoupon);

  const calculateTotal = () => {
    return subtotal - discount + orderSummary.delivery;
  };

  const fetchAddresses = async (userId: string | null) => {
    console.log("fethc adđ")
    try {
      const responseState = await callAddress(userId);

      if (responseState.status < 200 || responseState.status >= 300) {
        throw new Error("Request failed with status " + responseState.status);
      }

      const addressList =
        responseState.data._embedded.addressByUserIdResponseList.flatMap(
          (item: any) => item.addresses
        );

      setAddresses(addressList);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAddresses(userId);
  }, [userId, router]);

  useFocusEffect(
    React.useCallback(() => {
      // Mỗi khi màn hình được focus lại, fetch lại địa chỉ
      fetchAddresses(userId);
    }, [userId])
  );

  // Tính toán địa lý
  const handleSelectAddress = async (id: string) => {
    const address = addresses.find((address) => address.id === id);

    if (!address) {
      console.error("Address not found");
      return;
    }

    if (selectedAddress == address.id) {
      return;
    }

    const { street, commune, district, city, state, country } = address;
    const addressString = [street, commune, district, city, state, country]
      .filter(Boolean)
      .join(", ");

    // console.log(addressString);

    setLoading(true);

    try {
      const response = await callGeocoding(addressString);
      setGeocodingCaculater({
        distance: response.data.distance,
        duration: response.data.duration,
      });

      const feeString = response.data.fee;
      const feeAmount = Math.round(
        parseFloat(feeString.replace(" VND", "").replace(",", ""))
      );

      const newOrderSummary = {
        ...orderSummary,
        subtotal: calculateSubtotal(),
        delivery: feeAmount,
        total: Math.round(
          orderSummary.subtotal + feeAmount - (orderSummary.discount || 0)
        ),
      };
      console.log();
      setOrderSummary(newOrderSummary);
    } catch (error) {
      console.error("Error calling geocoding API", error);
      // notification.error({
      //   message: "Error calculating delivery fee",
      //   description: "Unable to calculate delivery fee. Please try again.",
      //   duration: 5,
      // });
    } finally {
      setLoading(false);
    }
  };

  // Quản lý state selected address
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
    setBottomModalAndTitle(false);
  };

  const handlePayment = async (paymentMethod: "COD" | "BANKING") => {
    setLoading(true);
    try {
      if (!userId || !selectedAddress || !checkoutItems?.length) {
        Toast.show({
          type: "customToast",
          text1: "Missing order information",
          onPress: () => Toast.hide(),
          visibilityTime: 1800,
        });
        return;
      }

      const response = await callCreateOrder(orderInformation);

      if (response.status === 200) {
        if (paymentMethod === "COD") {
          Toast.show({
            type: "customToast",
            text1: "Order success!",
            onPress: () => Toast.hide(),
            visibilityTime: 1800,
          });

          // console.log(response.data.message);

          const orderMessage = {
            orderId: response.data.message,
          };

          const queryParams = new URLSearchParams(orderMessage).toString();

          router.replace(`./orderSuccess?${queryParams}`);
          dispatch(doClearCartAction());
        } else if (paymentMethod === "BANKING") {
          const vnpayRedirectUrl = await callProcessPayment(
            response.data?.message
          );
          // console.log(vnpayRedirectUrl);
          dispatch(setPaymentUrl(vnpayRedirectUrl));
          router.push("../(task)/vpnPayment");
          dispatch(doClearCartAction());
        }
      } else {
        Toast.show({
          type: "customToast",
          text1: "Payment error!",
          onPress: () => Toast.hide(),
          visibilityTime: 1800,
        });
      }
    } catch (error) {
      Toast.show({
        type: "customToast",
        text1: "Payment error!",
        onPress: () => Toast.hide(),
        visibilityTime: 2000,
      });
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
      dispatch(resetCoupon());
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  console.log("Data: ", subtotal, discount, reduxCoupon);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <HeaderPage titlePage="Checkout" />
        <View>
          <View style={styles.spacingContainer}>
            <View style={{ padding: Spacing }}>
              <Text
                style={{ fontFamily: "outfit-medium", marginBottom: Spacing }}
              >
                Delivery address
              </Text>
              {addresses.length == 0 ? (
                <TouchableOpacity
                  onPress={() => router.push("../(account)/address")}
                  style={{
                    backgroundColor: Colors.primary_10,
                    padding: Spacing,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: Spacing * 0.8,
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
                    Create new address
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setBottomModalAndTitle(true)}
                  style={[
                    styles.flexEnd,
                    styles.dropShadow,
                    {
                      padding: Spacing,
                      borderRadius: Spacing * 0.8,
                    },
                  ]}
                >
                  <AntDesign name="arrowright" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>

            {selectedAddressUi && (
              <View style={{ padding: Spacing }}>
                <Text style={styles.regularText}>
                  {selectedAddressUi.phoneNumber}
                </Text>
                <Text style={styles.regularText}>
                  {selectedAddressUi?.street}
                </Text>
                <Text style={styles.regularText}>
                  {selectedAddressUi?.commune}, {selectedAddressUi?.state},{" "}
                  {selectedAddressUi?.city}, {selectedAddressUi?.country}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.spacingContainer,
              { paddingHorizontal: Spacing * 2 },
            ]}
          >
            <Text style={{ fontFamily: "outfit-medium" }}>Payment method</Text>
            <TouchableOpacity
              onPress={() => setPaymentMethod("COD")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: Spacing,
              }}
            >
              {paymentMethod == "COD" ? (
                <MaterialIcons
                  name="radio-button-checked"
                  size={Spacing * 2}
                  color={Colors.primary}
                />
              ) : (
                <MaterialIcons
                  name="radio-button-unchecked"
                  size={Spacing * 2}
                  color={Colors.gray}
                />
              )}
              <Text
                style={{ marginLeft: Spacing, fontFamily: "outfit-regular" }}
              >
                Cash on delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod("BANKING")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: Spacing,
              }}
            >
              {paymentMethod == "BANKING" ? (
                <MaterialIcons
                  name="radio-button-checked"
                  size={Spacing * 2}
                  color={Colors.primary}
                />
              ) : (
                <MaterialIcons
                  name="radio-button-unchecked"
                  size={Spacing * 2}
                  color={Colors.gray}
                />
              )}
              <Text
                style={{ marginLeft: Spacing, fontFamily: "outfit-regular" }}
              >
                VNPay
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spacingContainer}>
            <View
              style={{
                padding: Spacing,
                paddingTop: Spacing * 1.6,
                borderRadius: Spacing * 0.8,
                backgroundColor: Colors.white,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <View
                style={{
                  paddingVertical: Spacing * 0.4,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.small,
                    fontFamily: "outfit-bold",
                    marginBottom: Spacing,
                  }}
                >
                  Total Cart
                </Text>
                <View
                  style={{
                    borderColor: Colors.gray,
                    borderWidth: 1,
                    marginBottom: Spacing,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    Sub-Total:
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    {formatPrice(calculateSubtotal())} VND
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    Distance:
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    {geocodingCaculater.distance}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    Duration (About):
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    {geocodingCaculater.duration}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    Delivery:
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    {formatPrice(orderSummary.delivery)} VND
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    Discount:
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-regular",
                      marginBottom: Spacing,
                    }}
                  >
                    {formatPrice(discount)} VND
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: Colors.gray,
                    borderWidth: 1,
                    marginBottom: Spacing,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-bold",
                      marginBottom: Spacing,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.small,
                      fontFamily: "outfit-bold",
                      marginBottom: Spacing,
                    }}
                  >
                    {formatPrice(calculateTotal())} VND
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => handlePayment(paymentMethod)}
              >
                <Text style={styles.signInText}>Place Orlder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={loading}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>

      <BottomModal
        visible={bottomModalAndTitle}
        onTouchOutside={() => setBottomModalAndTitle(false)}
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.6}
        width={1}
        onSwipeOut={() => setBottomModalAndTitle(false)}
      >
        <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()} // Đảm bảo rằng 'id' là duy nhất và là kiểu dữ liệu chuỗi
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={async () => {
                  await handleAddressSelect(item.id);
                  await handleSelectAddress(item.id);
                }}
              >
                <View style={styles.addressContainer}>
                  <View style={styles.addressHeader}>
                    <Checkbox
                      value={selectedAddress === item.id}
                      onValueChange={async () => {
                        await handleAddressSelect(item.id);
                        await handleSelectAddress(item.id);
                      }}
                    />
                    <View style={styles.addressTypeContainer}>
                      <FontAwesome name="home" size={14} color="#3498db" />
                      <Text style={styles.addressTypeText}>
                        {item?.addressType.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addressDetailsContainer}>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={styles.userText}>
                        {userName}{" "}
                        <Text style={styles.phoneText}>
                          ( {item?.phoneNumber} )
                        </Text>
                      </Text>
                      <Text numberOfLines={1} style={styles.streetText}>
                        <Text style={styles.regularText}>{item?.street}</Text>
                      </Text>
                      <Text numberOfLines={2} style={styles.cityText}>
                        <Text style={styles.regularText}>
                          {item?.commune}, {item?.state}, {item?.city},{" "}
                          {item?.country}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default Checkout;

const styles = StyleSheet.create({
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
  spacingContainer: {
    padding: Spacing,
  },
  addressContainer: {
    backgroundColor: Colors.addressGray,
    borderRadius: Spacing * 0.8,
    padding: Spacing,
    marginBottom: Spacing,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing * 0.6,
    marginBottom: Spacing,
  },
  addressTypeContainer: {
    backgroundColor: Colors.primary_10,
    padding: Spacing * 0.4,
    paddingHorizontal: Spacing,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing * 0.4,
    borderRadius: Spacing * 0.8,
    flex: 1,
  },
  addressTypeText: {
    color: Colors.primary,
    fontFamily: "outfit-medium",
  },
  addressDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing,
    backgroundColor: Colors.white,
    borderRadius: Spacing * 0.8,
    padding: Spacing,
  },
  userText: {
    fontFamily: "outfit-medium",
  },
  phoneText: {
    fontFamily: "outfit-regular",
  },
  streetText: {
    fontFamily: "outfit-bold",
  },
  regularText: {
    fontFamily: "outfit-regular",
  },
  cityText: {
    fontFamily: "outfit-bold",
  },
  signInButton: {
    padding: Spacing * 1.6,
    backgroundColor: Colors.primary,
    marginTop: Spacing * 2,
    borderRadius: Spacing,
    shadowColor: Colors.white,
  },
  signInText: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    color: Colors.white,
    fontSize: FontSize.medium,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
