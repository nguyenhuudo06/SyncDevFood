import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import React from "react";
import Spacing from "@/constants/Spacing";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

const OrderSuccess = () => {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.padding_10, { alignItems: "center" }]}>
        <View style={{ marginVertical: Spacing * 2 }}>
          <AntDesign name="checkcircle" size={Spacing * 6} color="green" />
        </View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: FontSize.large,
            marginBottom: Spacing,
          }}
        >
          Order Placed Successfully!
        </Text>
        <View
          style={{
            backgroundColor: Colors.primary_10,
            padding: Spacing * 2,
            borderRadius: Spacing * 0.8,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Entypo name="mail" size={Spacing * 2} color={Colors.primary} />
          <Text
            style={{
              fontFamily: "outfit-regular",
              fontSize: FontSize.medium,
              textAlign: "center",
            }}
          >
            We have sent the order confirmation to your email. Please check your
            inbox for order details.
          </Text>
        </View>
        <View style={{ marginVertical: Spacing * 2 }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: FontSize.small,
            }}
          >
            Order ID:{" "}
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: FontSize.small,
              }}
            >
              {orderId || ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: Spacing,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.push("../(tabs)/home")}>
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: FontSize.small,
                backgroundColor: Colors.primary,
                color: Colors.white,
                padding: Spacing,
                borderRadius: Spacing * 1.8,
              }}
            >
              By More Dishes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../(account)/order")}>
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: FontSize.small,
                backgroundColor: Colors.primary,
                color: Colors.white,
                padding: Spacing,
                borderRadius: Spacing * 1.8,
              }}
            >
              View Orders
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
    flex: 1
  },
  padding_10: {
    padding: Spacing,
  },
});
