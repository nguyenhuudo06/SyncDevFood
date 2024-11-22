import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown as DropdownLib } from "react-native-element-dropdown";

const dataProvinces = [
  { label: "Hà Nội", value: "hanoi" },
  { label: "Hồ Chí Minh", value: "hochiminh" },
  { label: "Đà Nẵng", value: "danang" },
];

const dataDistricts = [
  { label: "Quận 1", value: "quan1" },
  { label: "Quận 2", value: "quan2" },
  { label: "Quận 3", value: "quan3" },
];

const dataWards = [
  { label: "Phường 1", value: "phuong1" },
  { label: "Phường 2", value: "phuong2" },
  { label: "Phường 3", value: "phuong3" },
];

const renderItem = (item) => {
  return <Text style={styles.dropdownItem}>{item.label}</Text>;
};

const AddressForm = () => {
  const [phoneNumber, setPhoneNumber] = useState<"home" | "other" | "office">(
    "home"
  );

  const handlePhoneNumberChange = (text) => {
    // Chỉ cho phép nhập số
    const filteredText = text.replace(/[^0-9]/g, "");
    setPhoneNumber(filteredText);
  };

  const [addressType, setAddressType] = useState<"home" | "other" | "company">(
    "home"
  );

  // Gộp state thành object để quản lý
  const [address, setAddress] = useState({
    province: null,
    district: null,
    ward: null,
    specificAddress: "",
  });

  const [isFocused, setIsFocused] = useState(false);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Tỉnh */}
        <Text style={styles.label}>Tỉnh/Thành phố</Text>
        <DropdownLib
          style={[styles.dropdown, address.province && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dataProvinces}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Chọn Tỉnh/Thành phố"}
          value={address.province}
          onChange={(item) =>
            setAddress({
              province: item.value,
              district: null, // Xóa giá trị huyện
              ward: null, // Xóa giá trị xã
              specificAddress: address.specificAddress,
            })
          }
          renderItem={renderItem}
        />

        {/* Huyện */}
        <Text style={styles.label}>Quận/Huyện</Text>
        <DropdownLib
          style={[
            styles.dropdown,
            !address.province && styles.disabledDropdown,
            address.province && { borderColor: "green" },
            address.district && { borderColor: "blue" },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dataDistricts}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Chọn Quận/Huyện"}
          value={address.district}
          disable={!address.province} // Vô hiệu hóa nếu chưa chọn tỉnh
          onChange={(item) =>
            setAddress({
              ...address,
              district: item.value,
              ward: null, // Xóa giá trị xã
            })
          }
          renderItem={renderItem}
        />

        {/* Xã */}
        <Text style={styles.label}>Xã/Phường</Text>
        <DropdownLib
          style={[
            styles.dropdown,
            !address.district && styles.disabledDropdown,
            address.district && { borderColor: "green" },
            address.ward && { borderColor: "blue" },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dataWards}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Chọn Xã/Phường"}
          value={address.ward}
          disable={!address.district} // Vô hiệu hóa nếu chưa chọn huyện
          onChange={(item) =>
            setAddress({
              ...address,
              ward: item.value,
            })
          }
          renderItem={renderItem}
        />

        {/* Địa chỉ cụ thể */}
        <Text style={styles.label}>Địa chỉ cụ thể</Text>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocus]}
          placeholder="Nhập địa chỉ cụ thể"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
          placeholder="Nhập số điện thoại"
          placeholderTextColor="gray"
          keyboardType="phone-pad" // Hiển thị bàn phím số
          maxLength={11} // Giới hạn tối đa 10 ký tự (theo chuẩn số điện thoại)
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange} // Xử lý thay đổi đầu vào
        />

        <Text style={styles.label}>Address Type</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: Spacing,
            gap: Spacing * 1.6,
            marginBottom: Spacing * 1.6,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setAddressType("home");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {addressType == "home" ? (
              <Ionicons
                name="radio-button-on"
                size={Spacing * 2}
                color={Colors.primary}
              />
            ) : (
              <Ionicons
                name="radio-button-off-sharp"
                size={Spacing * 2}
                color="black"
              />
            )}

            <Text
              style={{
                fontFamily: "outfit-regular",
                marginLeft: Spacing * 0.6,
              }}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAddressType("company");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {addressType == "company" ? (
              <Ionicons
                name="radio-button-on"
                size={Spacing * 2}
                color={Colors.primary}
              />
            ) : (
              <Ionicons
                name="radio-button-off-sharp"
                size={Spacing * 2}
                color="black"
              />
            )}

            <Text
              style={{
                fontFamily: "outfit-regular",
                marginLeft: Spacing * 0.6,
              }}
            >
              Company
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAddressType("other");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {addressType == "other" ? (
              <Ionicons
                name="radio-button-on"
                size={Spacing * 2}
                color={Colors.primary}
              />
            ) : (
              <Ionicons
                name="radio-button-off-sharp"
                size={Spacing * 2}
                color="black"
              />
            )}

            <Text
              style={{
                fontFamily: "outfit-regular",
                marginLeft: Spacing * 0.6,
              }}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing * 0.4,
              backgroundColor: Colors.primary,
              padding: Spacing * 0.6,
              borderRadius: Spacing * 2,
              paddingHorizontal: Spacing * 1.6,
            }}
          >
            <Feather name="save" size={Spacing * 2} color={Colors.white} />
            <Text style={{ color: Colors.white, fontFamily: "outfit-regular" }}>
              Save Address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddressForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  scrollView: {
    backgroundColor: "#fff",
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
    height: 50,
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
    borderColor: "blue", // Tùy chỉnh viền khi focus (nếu cần)
  },
  disabledDropdown: {
    backgroundColor: "#e0e0e0", // Màu nền xám nhạt
    borderColor: "#d0d0d0", // Viền mờ hơn
  },
  disabledText: {
    color: "gray", // Màu chữ xám khi disable
  },
  dropdownItem: {
    fontSize: 16,
    color: "black", // Màu chữ của item trong dropdown
    fontFamily: "outfit-regular",
    padding: Spacing * 1.6,
  },
});
