import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "@/components/Material/BackButton";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  callAddAddress,
  callAddress,
  callCommuneService,
  callDeleteAddress,
  callDistrictService,
  callProvincialService,
} from "@/services/api-call";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import { Dropdown as DropdownLib } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";

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

const renderItem = (item) => {
  return <Text style={styles.dropdownItem}>{item.name}</Text>;
};

const Address = () => {
  const [provincesData, setProvincesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [wardsData, setWardsData] = useState([]);

  const userId = useSelector((state: RootState) => state.auth.user_id);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressType, setAddressType] = useState("home");

  console.log("address data form: ", address, phoneNumber, addressType, userId);

  const fetchAddNewAddress = async () => {
    try {
      const responseProvince = await callAddAddress(
        address.specificAddress,
        "Việt Nam",
        address.province,
        addressType,
        address.district,
        address.ward,
        phoneNumber,
        userId
      );

      if (responseProvince.status < 200 || responseProvince.status >= 300) {
        throw new Error(
          "Request failed with status " + responseProvince.status
        );
      }

      Toast.show({
        type: "customToast",
        text1: "Address add successful!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
      setAddress({
        province: "",
        district: "",
        ward: "",
        specificAddress: "",
      });
      setPhoneNumber("");
      setAddressType("home");
      setShowAddressForm(false);
    } catch (error) {
      Toast.show({
        type: "customToast",
        text1: "Cannot add address!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    }
  };

  const handleAddNewAddress = () => {
    if (
      !address.province ||
      !address.district ||
      !address.ward ||
      !address.specificAddress ||
      !userId ||
      !phoneNumber ||
      !addressType
    ) {
      Toast.show({
        type: "customToast",
        text1: "Incomplete information",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    } else {
      fetchAddNewAddress();
    }
  };

  const handlePhoneNumberChange = (text) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setPhoneNumber(filteredText);
  };

  const fetchProvincialService = async () => {
    try {
      const responseProvince = await callProvincialService();

      if (responseProvince.status < 200 || responseProvince.status >= 300) {
        throw new Error(
          "Request failed with status " + responseProvince.status
        );
      }

      setProvincesData(responseProvince.data.results);
    } catch (error) {}
  };

  const fetchDistrictService = async (code: string) => {
    try {
      const response = await callDistrictService(code);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      setDistrictsData(response.data.results);
    } catch (error) {}
  };

  const fetchCommuneService = async (code: string) => {
    try {
      const response = await callCommuneService(code);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      setWardsData(response.data.results);
    } catch (error) {}
  };

  const fetchAddress = async () => {
    try {
      const responseState = await callAddress(userId);

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

      await fetchAddress();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    fetchProvincialService();
  }, []);

  return (
    <ScrollView style={styles.content}>
      <HeaderPage titlePage="Address" />
      {!showAddressForm ? (
        <>
          <View style={styles.spacing}>
            <TouchableOpacity
              onPress={() => {
                setShowAddressForm(true);
              }}
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
          </View>
          <View style={[styles.content, styles.spacing]}>
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
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Text style={styles.label}>Province/City</Text>
            <DropdownLib
              style={[
                styles.dropdown,
                address.province && { borderColor: "blue" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={provincesData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select Province/City"}
              value={address.province}
              onChange={async (item) => {
                await setAddress({
                  province: item.name,
                  district: null,
                  ward: null,
                  specificAddress: address.specificAddress,
                });
                await fetchDistrictService(item.code);
              }}
              renderItem={renderItem}
            />

            <Text style={styles.label}>District</Text>
            <DropdownLib
              style={[
                styles.dropdown,
                !address.province && styles.disabledDropdown,
                address.province && { borderColor: "green" },
                address.district && { borderColor: "blue" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={districtsData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select District"}
              value={address.district}
              disable={!address.province}
              onChange={async (item) => {
                await setAddress({
                  ...address,
                  district: item.name,
                  ward: null,
                });
                await fetchCommuneService(item.code);
              }}
              renderItem={renderItem}
            />

            <Text style={styles.label}>Ward</Text>
            <DropdownLib
              style={[
                styles.dropdown,
                !address.district && styles.disabledDropdown,
                address.district && { borderColor: "green" },
                address.ward && { borderColor: "blue" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={wardsData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select Ward"}
              value={address.ward}
              disable={!address.district}
              onChange={(item) =>
                setAddress({
                  ...address,
                  ward: item.name,
                })
              }
              renderItem={renderItem}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input]}
              placeholder="Enter address"
              placeholderTextColor="gray"
              value={address.specificAddress}
              onChangeText={(text) =>
                setAddress({
                  ...address,
                  specificAddress: text,
                })
              }
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              maxLength={16}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
            />

            <Text style={styles.label}>Address Type</Text>
            <View style={styles.radioButtonsContainer}>
              {["home", "company", "other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setAddressType(type)}
                  style={styles.radioButton}
                >
                  <Ionicons
                    name={
                      addressType === type
                        ? "radio-button-on"
                        : "radio-button-off-sharp"
                    }
                    size={Spacing * 2}
                    color={addressType === type ? Colors.primary : "black"}
                  />
                  <Text style={styles.radioButtonLabel}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleAddNewAddress()}
              >
                <Feather name="save" size={Spacing * 2} color={Colors.white} />
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddressForm(false)}
                style={styles.cancelButton}
              >
                <Feather name="save" size={Spacing * 2} color={Colors.white} />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: "#fff" },
  spacing: {
    padding: Spacing,
  },
  titlePage: {
    fontSize: FontSize.xLarge,
    fontFamily: "outfit-bold",
  },
  container: {
    padding: Spacing,
  },
  dropdown: {
    height: Spacing * 4,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    fontFamily: "outfit-regular",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: "black",
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    outlineColor: "transparent",
    marginBottom: Spacing * 1.6,
    fontFamily: "outfit-regular",
  },
  inputFocus: {
    borderWidth: 1,
    borderColor: "blue",
  },
  disabledDropdown: {
    backgroundColor: "#e0e0e0",
    borderColor: "#d0d0d0",
  },
  dropdownItem: {
    fontSize: 16,
    color: "black",
    fontFamily: "outfit-regular",
    padding: Spacing * 1.6,
  },
  radioButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing,
    gap: Spacing * 1.6,
    marginBottom: Spacing * 1.6,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonLabel: {
    fontFamily: "outfit-regular",
    marginLeft: Spacing * 0.6,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing * 0.4,
    backgroundColor: Colors.primary,
    padding: Spacing * 0.6,
    borderRadius: Spacing * 2,
    paddingHorizontal: Spacing * 1.6,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing * 0.4,
    backgroundColor: Colors.danger,
    padding: Spacing * 0.6,
    borderRadius: Spacing * 2,
    paddingHorizontal: Spacing * 1.6,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: "outfit-regular",
  },
});

export default Address;
