import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import React from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";

const Slider = () => {
  const sliderList = [
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
  ];

  return (
    <View>
      <Text style={styles.title}>#Special for you</Text>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.sliderContainer} // Thêm style cho container
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
    padding: Spacing * 2,
    paddingBottom: 5,
  },
  sliderContainer: {
    paddingHorizontal: Spacing * 2,
  },
  image: {
    width: 300,
    height: 160,
    marginRight: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default Slider;
