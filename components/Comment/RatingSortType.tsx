import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";

const StarRating = ({ numberOfStars = 0, callbackFnc }) => {
  // Render các ngôi sao
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < numberOfStars; // Kiểm tra nếu sao được tô màu

      return (
        <View key={index} style={styles.starButton}>
          {isFilled ? (
            <AntDesign name="star" size={Spacing * 2} color={"#FFD700"} />
          ) : (
            <AntDesign name="staro" size={Spacing * 2} color={"#FFD700"} />
          )}
        </View>
      );
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => callbackFnc()}>
      {renderStars()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: Spacing * 0.4,
  },
  starButton: {
    marginHorizontal: 5,
  },
});

export default StarRating;
