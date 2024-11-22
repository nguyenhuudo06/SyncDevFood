import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { BottomModal, ModalTitle, ModalContent } from "react-native-modals";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
  container: {},
  container2: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "#000",
  },
});

const data = Array.from({ length: 10 }, (_, index) => ({
  id: String(index), // mỗi item cần có id duy nhất
  title: `Item ${index + 1}`,
}));

const Test = () => {
  const [bottomModalAndTitle, setBottomModalAndTitle] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Bottom" onPress={() => setBottomModalAndTitle(true)} />
      </View>

      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: Colors.gray,
          margin: Spacing,
        }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={
            imageError
              ? require("../../assets/images/avatart-template.jpg") // Đường dẫn đến ảnh mặc định
              : {
                  uri: "https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png",
                }
          }
          onError={() => setImageError(true)}
        />
      </View>

      <BottomModal
        visible={bottomModalAndTitle}
        onTouchOutside={() => setBottomModalAndTitle(false)}
        overlayBackgroundColor="rgba(0, 0, 0, 0.1)"
        height={0.3}
        width={1}
        onSwipeOut={() => setBottomModalAndTitle(false)}
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
    </View>
  );
};

export default Test;
