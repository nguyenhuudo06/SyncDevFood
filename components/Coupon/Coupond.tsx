import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import Toast from "react-native-toast-message";
import Spacing from "@/constants/Spacing";

const Coupon = ({ couponResponseList }) => {
  console.log(couponResponseList);

  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    Toast.show({
      type: "error",
      text1: "Coupon copied!",
      onPress: () => Toast.hide(),
    });
  };

  const renderItem = ({ item }: { item: (typeof couponResponseList)[0] }) => (
    <TouchableOpacity
      style={styles.couponContainer}
      onPress={() => copyToClipboard(item.couponCode)}
    >
      <Text style={styles.couponCode}>Code: {item.couponCode}</Text>
      <Text style={styles.couponDescription}>
        {item.description || "No description available."}
      </Text>
      <Text style={styles.couponDetails}>
        Discount: {item.discountPercent}% (Max: $
        {item.maxDiscount || "No limit"})
      </Text>
      <Text style={styles.couponDetails}>
        Min Order: ${item.minOrderValue} | Available: {item.availableQuantity}
      </Text>
      <Text style={styles.couponDetails}>
        Valid: {item.startDate} to {item.expirationDate}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.title}>Available Coupons</Text>
      <FlatList
        data={couponResponseList}
        renderItem={renderItem}
        keyExtractor={(item) => item.couponId}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  title: {
    fontSize: FontSize.medium,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  couponContainer: {
    backgroundColor: Colors.primary_10,
    padding: 15,
    borderRadius: 8,
    marginBottom: Spacing,
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  couponCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  couponDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    marginBottom: 5,
  },
  couponDetails: {
    fontSize: 12,
    color: "#777",
  },
});

export default Coupon;
