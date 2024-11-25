import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Dropdown as DropdownLib } from "react-native-element-dropdown";

const provincesData = [
  { label: "Hà Nội", value: "hanoi" },
  { label: "Hồ Chí Minh", value: "hochiminh" },
  { label: "Đà Nẵng", value: "danang" },
];

const districtsData = [
  { label: "Quận 1", value: "quan1" },
  { label: "Quận 2", value: "quan2" },
  { label: "Quận 3", value: "quan3" },
];

const wardsData = [
  { label: "Phường 1", value: "phuong1" },
  { label: "Phường 2", value: "phuong2" },
  { label: "Phường 3", value: "phuong3" },
];

const renderItem = (item) => {
  return <Text style={styles.dropdownItem}>{item.label}</Text>;
};

const AddressForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("home");

  const handlePhoneNumberChange = (text) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setPhoneNumber(filteredText);
  };

  const [addressType, setAddressType] = useState("home");

  const [address, setAddress] = useState({
    province: null,
    district: null,
    ward: null,
    specificAddress: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Province/City</Text>
      <DropdownLib
        style={[styles.dropdown, address.province && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={provincesData}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Select Province/City"}
        value={address.province}
        onChange={(item) =>
          setAddress({
            province: item.value,
            district: null,
            ward: null,
            specificAddress: address.specificAddress,
          })
        }
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
        onChange={(item) =>
          setAddress({
            ...address,
            district: item.value,
            ward: null,
          })
        }
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
            ward: item.value,
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
        <TouchableOpacity style={styles.applyButton}>
          <Feather name="save" size={Spacing * 2} color={Colors.white} />
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Feather name="save" size={Spacing * 2} color={Colors.white} />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressForm;

const styles = StyleSheet.create({
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
