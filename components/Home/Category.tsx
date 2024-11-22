import { View, Text } from "react-native";
import React from "react";
import CategoryItem from "./CategoryItem";
import TabContent from "./TabContent";

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
            fontSize: 20,
            fontFamily: "outfit-bold",
          }}
        >
          Category
        </Text>
        <Text style={{ color: "#29adff", fontFamily: "outfit-medium" }}>
          View all
        </Text>
      </View>
      {/* <CategoryItem /> */}
      <TabContent />
    </View>
  );
};

export default Category;
