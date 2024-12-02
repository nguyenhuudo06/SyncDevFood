import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Text,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { callCreateReview } from "@/services/api-call";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const StarRatingWithComment = ({ dishId }) => {
  const [selectedStars, setSelectedStars] = useState(0); // Số sao được chọn
  const [comment, setComment] = useState(""); // Nội dung comment
  const userId = useSelector((state: RootState) => state.auth.user_id);

  const handleStarPress = (index) => {
    setSelectedStars(index + 1); // Đặt số sao được chọn
  };

  const handleSend = async () => {
    if (!selectedStars || !comment.trim()) {
      Toast.show({
        type: "customToast",
        text1: "No rating or comment selected yet!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
      return;
    }

    if (!userId) {
      Toast.show({
        type: "customToast",
        text1: "Login to comment!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
      return;
    }

    try {
      const response = await callCreateReview(
        dishId,
        Number(selectedStars),
        comment,
        userId
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      Toast.show({
        type: "customToast",
        text1: "Rating successfully!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      Toast.show({
        type: "customToast",
        text1: "Cannot add comment!",
        onPress: () => Toast.hide(),
        visibilityTime: 1800,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Vùng đánh giá sao */}
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(index)} // Xử lý nhấn sao
          >
            <AntDesign
              name="star"
              size={Spacing * 2}
              color={index < selectedStars ? "gold" : Colors.gray} // Đổi màu
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Vùng nhập comment */}
      <TextInput
        style={styles.textInput}
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment} // Cập nhật nội dung comment
        multiline
      />

      {/* Nút gửi */}
      <TouchableOpacity onPress={handleSend}>
        <Text style={styles.commentButton}>Send comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing,
    backgroundColor: "#fff",
    flex: 1,
  },
  starContainer: {
    flexDirection: "row", // Hiển thị các sao theo hàng ngang
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    height: 100, // Tăng chiều cao vùng nhập
    textAlignVertical: "top", // Canh nội dung ở đầu vùng nhập
    fontFamily: "outfit-regular",
  },
  commentButton: {
    width: "100%",
    padding: Spacing,
    textAlign: "center",
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontFamily: "outfit-medium",
    borderRadius: Spacing * 0.8,
  },
});

export default StarRatingWithComment;
