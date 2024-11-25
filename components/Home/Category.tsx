import { View, Text } from "react-native";
import React from "react";
import CategoryItem from "./CategoryItem";
import TabContent from "./TabContent";
import FontSize from "@/constants/FontSize";

const Category = () => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.medium,
            fontFamily: "outfit-bold",
          }}
        >
          Explore
        </Text>
      </View>
      {/* <CategoryItem /> */}
      <TabContent />
    </View>
  );
};

export default Category;
