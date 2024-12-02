import Spacing from "@/constants/Spacing";
import React from "react";
import { View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StarRating = ({ rating, styleCus }: { rating: number }) => {
  const stars = [];

  // Lặp qua 5 vị trí để xác định loại sao cần render
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      // Sao đầy
      stars.push(<FontAwesome key={i} name="star" size={Spacing * 2} color="gold" />);
    } else if (i < rating) {
      // Nửa sao
      stars.push(
        <FontAwesome key={i} name="star-half-empty" size={Spacing * 2} color="gold" />
      );
    } else {
      // Sao trống
      stars.push(<FontAwesome key={i} name="star-o" size={Spacing * 2} color="gray" />);
    }
  }

  return <View style={[{ flexDirection: "row" }, styleCus]}>{stars}</View>;
};

export default StarRating;
