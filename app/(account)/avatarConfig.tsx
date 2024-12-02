import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import instance from "@/utils/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BottomModal, ModalTitle, ModalContent } from "react-native-modals";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import ImageWithFallback from "@/components/Image/ImageWithFallback";
import { callProfile, callUpdateAvatar } from "@/services/api-call";
import axios from "axios";
import Toast from "react-native-toast-message";
import { login } from "@/redux/authSlice/authSlice";

const AvatarConfig = () => {
  const userData = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [bottomModalImage, setBottomModalImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const user_avatar = useSelector((state: RootState) => state.auth.user_avatar);

  // console.log(selectedImage);

  // Hỏi quyền đăng nhập
  const requestPermission = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Access denied!");
      return false; // Trả về false nếu không có quyền truy cập
    }

    return true; // Trả về true nếu đã có quyền truy cập
  };

  // Mở thư viện ảnh
  const pickImage = async () => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Cho phép chỉnh sửa ảnh
      aspect: [3, 3], // Tỉ lệ chỉnh sửa (nếu cần)
      quality: 1, // Chất lượng ảnh (1 là cao nhất)
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Chụp ảnh bằng camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Ứng dụng cần quyền sử dụng camera để hoạt động."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Cho phép chỉnh sửa
      aspect: [3, 3], // Tỉ lệ
      quality: 1, // Chất lượng
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Upload ảnh
  // const uploadImage = async () => {
  //   if (!selectedImage) {
  //     Alert.alert("Thông báo", "Vui lòng chọn một ảnh để upload.");
  //     return;
  //   }

  //   const imageUri = selectedImage;
  //   const filename = imageUri.split("/").pop();
  //   const match = /\.(\w+)$/.exec(filename);
  //   const type = match ? `image/${match[1]}` : `image`;

  //   try {
  //     // Sử dụng fetch để tải file và chuyển đổi thành Blob
  //     const response = await fetch(imageUri);
  //     const blob = await response.blob();

  //     // Tạo FormData và thêm file
  //     const formData = new FormData();
  //     formData.append("file", blob, filename);

  //     console.log(formData);

  //     const apiResponse = await callUpdateAvatar(formData);

  //     if (apiResponse.status != 200) throw new Error("Error upload avatar!");

  //     Alert.alert("Thành công", "Ảnh đã được upload!");
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Axios Error Details:");
  //       console.error("Message:", error.message);

  //       if (error.response) {
  //         // Lỗi từ phía server (status code, dữ liệu phản hồi)
  //         console.error("Response data:", error.response.data);
  //         console.error("Response status:", error.response.status);
  //         console.error("Response headers:", error.response.headers);
  //       } else if (error.request) {
  //         // Lỗi khi request đã được gửi nhưng không nhận được phản hồi
  //         console.error("Request details:", error.request);
  //       } else {
  //         // Lỗi khác (thường là lỗi cấu hình)
  //         console.error("Error config:", error.config);
  //       }
  //     } else {
  //       // Lỗi không thuộc axios (có thể do các thư viện khác)
  //       console.error("Unknown error:", error);
  //     }
  //     Alert.alert("Lỗi", "Không thể upload ảnh.");
  //   }
  // };

  const uploadImage = async () => {
    if (!selectedImage) {
      Toast.show({
        type: "customToast",
        text1: "No image selected yet!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });
      return;
    }

    const imageUri = selectedImage;
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    try {
      // Sử dụng fetch để tải file và chuyển đổi thành Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Tạo FormData và thêm file
      const formData = new FormData();
      formData.append("file", blob, filename);

      console.log(formData);

      const apiResponse = await callUpdateAvatar(formData);

      if (apiResponse.status != 200) throw new Error("Error upload avatar!");

      Toast.show({
        type: "customToast",
        text1: "Uploaded successfully!",
        onPress: () => Toast.hide(),
        visibilityTime: 1000,
      });

      const responseProfile = await callProfile();

      if (responseProfile.status != 200)
        throw new Error("Error fetch profile!");

      dispatch(login(responseProfile.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Message:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
      Alert.alert("Lỗi", "Không thể upload ảnh.");
    }
  };

  return (
    <>
      <ScrollView style={styles.content}>
        <HeaderPage titlePage="Avatar edit" />
        <View
          style={[
            styles.spacing,
            {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 200,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: Colors.gray,
              marginBottom: Spacing * 2,
            }}
          >
            <ImageWithFallback
              source={{ uri: selectedImage || user_avatar }}
              fallbackSource={require("../../assets/images/avatar-png.png")}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: Spacing * 1.6,
              }}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: Spacing * 2,
            }}
          >
            <TouchableOpacity
              onPress={() => openCamera()}
              style={{
                alignItems: "center",
                padding: Spacing,
                paddingHorizontal: Spacing * 1.6,
                backgroundColor: "#f1f4f5",
                borderRadius: Spacing,
              }}
            >
              <Feather
                name="camera"
                size={Spacing * 2.6}
                color={Colors.primary}
              />
              <Text style={{ fontFamily: "outfit-regular" }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                alignItems: "center",
                padding: Spacing,
                paddingHorizontal: Spacing * 1.6,
                backgroundColor: "#f1f4f5",
                borderRadius: Spacing,
              }}
            >
              <Ionicons
                name="image-outline"
                size={Spacing * 2.6}
                color={Colors.primary}
              />
              <Text style={{ fontFamily: "outfit-regular" }}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => uploadImage()}
              style={{
                backgroundColor: Colors.primary,
                padding: Spacing,
                borderRadius: Spacing * 0.8,
              }}
            >
              <Text
                style={{ color: Colors.white, fontFamily: "outfit-medium" }}
              >
                Upload avatar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomModal
        visible={bottomModalImage}
        onTouchOutside={() => setBottomModalImage(false)}
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.3}
        width={1}
        onSwipeOut={() => setBottomModalImage(false)}
      >
        <ModalContent style={{ flex: 1, backgroundColor: Colors.white }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: FontSize.large,
                  fontFamily: "outfit-medium",
                  marginBottom: Spacing * 1.6,
                }}
              >
                Profile photo
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => openCamera()}
                style={{
                  alignItems: "center",
                  padding: Spacing,
                  paddingHorizontal: Spacing * 1.6,
                  backgroundColor: "#f1f4f5",
                  borderRadius: Spacing,
                }}
              >
                <Feather
                  name="camera"
                  size={Spacing * 2.6}
                  color={Colors.primary}
                />
                <Text style={{ fontFamily: "outfit-regular" }}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{
                  alignItems: "center",
                  padding: Spacing,
                  paddingHorizontal: Spacing * 1.6,
                  backgroundColor: "#f1f4f5",
                  borderRadius: Spacing,
                }}
              >
                <Ionicons
                  name="image-outline"
                  size={Spacing * 2.6}
                  color={Colors.primary}
                />
                <Text style={{ fontFamily: "outfit-regular" }}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => uploadImage()}
                style={{
                  alignItems: "center",
                  padding: Spacing,
                  paddingHorizontal: Spacing * 1.6,
                  backgroundColor: "#f1f4f5",
                  borderRadius: Spacing,
                }}
              >
                <FontAwesome
                  name="trash-o"
                  size={Spacing * 2.6}
                  color={Colors.gray}
                />
                <Text style={{ fontFamily: "outfit-regular" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default AvatarConfig;

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: "#fff" },
  spacing: {
    padding: Spacing,
  },
});
