import React, { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const ImgSelect = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Hàm yêu cầu quyền truy cập
  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Ứng dụng cần quyền truy cập thư viện ảnh để hoạt động."
        );
        return false;
      }
    }
    return true;
  };

  // Mở thư viện ảnh
  const pickImage = async () => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Cho phép chỉnh sửa ảnh
      aspect: [4, 3], // Tỉ lệ chỉnh sửa (nếu cần)
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
      aspect: [4, 3], // Tỉ lệ
      quality: 1, // Chất lượng
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Upload ảnh
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Thông báo", "Vui lòng chọn một ảnh để upload.");
      return;
    }

    const imageUri = selectedImage;
    const filename = imageUri.split("/").pop(); // Lấy tên file từ đường dẫn
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("photo", { uri: imageUri, name: filename, type });

    try {
      const response = await fetch("https://your-server-api.com/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) throw new Error("Lỗi upload ảnh.");
      const result = await response.json();
      Alert.alert("Thành công", "Ảnh đã được upload!");
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể upload ảnh.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      <Button title="Chụp ảnh bằng camera" onPress={openCamera} />
      <Button title="Upload ảnh" onPress={uploadImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
});

export default ImgSelect;
