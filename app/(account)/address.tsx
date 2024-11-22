import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "@/components/Material/BackButton";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { callAddress, callDeleteAddress } from "@/services/api-call";
import HeaderPage from "@/components/HeaderPage/HeaderPage";

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
}

const Address = () => {
  const [addressList, setAddressList] = useState<Address[]>([]);

  const fetchState = async () => {
    try {
      const responseState = await callAddress(
        "53e4992a-a82e-41b2-9b95-10530779bc79"
      );

      if (responseState.status < 200 || responseState.status >= 300) {
        throw new Error("Request failed with status " + responseState.status);
      }

      const addressList =
        responseState.data._embedded.addressByUserIdResponseList.flatMap(
          (item) => item.addresses
        );
      setAddressList(addressList);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const deleteAdress = async (addressId: string) => {
    // console.log(addressId)
    try {
      const responseDeleteAddress = await callDeleteAddress(addressId);

      if (
        responseDeleteAddress.status < 200 ||
        responseDeleteAddress.status >= 300
      ) {
        throw new Error(
          "Request failed with status " + responseDeleteAddress.status
        );
      }

      await fetchState();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HeaderPage titlePage="Address" />
        <View style={styles.spacing}>
          <TouchableOpacity
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
              style={{ fontFamily: "outfit-medium", marginLeft: Spacing * 0.8 }}
            >
              Create new address
            </Text>
          </TouchableOpacity>

          <View>
            {addressList.map((item) => (
              <TouchableOpacity key={item.id}>
                <View
                  style={{
                    backgroundColor: Colors.addressGray,
                    borderRadius: Spacing * 0.8,
                    padding: Spacing,
                    marginBottom: Spacing,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: Spacing * 0.6,
                      marginBottom: Spacing,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.primary_10,
                        padding: Spacing * 0.4,
                        paddingHorizontal: Spacing,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: Spacing * 0.4,
                        borderRadius: Spacing * 0.8,
                        flex: 1,
                      }}
                    >
                      <FontAwesome
                        name="home"
                        size={FontSize.small}
                        color={Colors.primary}
                      />
                      <Text
                        style={{
                          color: Colors.primary,
                          fontFamily: "outfit-medium",
                        }}
                      >
                        {item?.addressType.toUpperCase()}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        padding: Spacing * 0.6,
                        backgroundColor: Colors.primary_10,
                        borderRadius: Spacing * 0.4,
                      }}
                    >
                      <FontAwesome
                        name="edit"
                        size={FontSize.small}
                        color={Colors.active}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteAdress(item.id)}
                      style={{
                        padding: Spacing * 0.6,
                        backgroundColor: Colors.primary_10,
                        borderRadius: Spacing * 0.4,
                      }}
                    >
                      <FontAwesome
                        name="trash-o"
                        size={FontSize.small}
                        color={Colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: Spacing,
                      backgroundColor: Colors.white,
                      borderRadius: Spacing * 0.8,
                      padding: Spacing,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        Phone:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.phoneNumber}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        Street:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.street}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        Commune:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.commune}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        State:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.state}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        City:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.city}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: "outfit-bold" }}
                      >
                        Country:{" "}
                        <Text style={{ fontFamily: "outfit-regular" }}>
                          {item?.country}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  spacing: {
    padding: Spacing,
  },
  titlePage: {
    fontSize: FontSize.xLarge,
    fontFamily: "outfit-bold",
  },
});

export default Address;
