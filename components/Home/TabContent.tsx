import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

const CategoryItem = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      name: "Home",
      icon: "home",
      redirectUrl: "../(tabs)/home",
    },
    {
      name: "Food",
      icon: "cutlery",
      redirectUrl: "../(tabs)/search",
    },
    {
      name: "Blog",
      icon: "book",
      redirectUrl: "../(blog)/blogList",
    },
    {
      name: "Order",
      icon: "truck",
      redirectUrl: "../(account)/order",
    },
  ];

  return (
    <View style={styles.container}>
      {categories.map((item, index) => (
        <View key={index} style={styles.itemWrapper}>
          <TouchableOpacity
            style={[
              styles.itemContainer,
              activeIndex === index && styles.activeContainer,
            ]}
            onPress={() => router.push(item.redirectUrl)}
          >
            <Icon
              name={item.icon}
              size={40}
              color={activeIndex === index ? Colors.white : Colors.primary}
            />
          </TouchableOpacity>
          <Text
            style={[styles.itemText, { width: "100%" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Đặt hướng bố cục là hàng
    justifyContent: "flex-start", // Căn giữa các mục
    paddingVertical: 10,
    paddingHorizontal: 2,
    gap: 12,
  },
  itemWrapper: {
    alignItems: "center", // Căn giữa các mục
  },
  itemContainer: {
    width: 78,
    height: 80,
    padding: 8,
    backgroundColor: "#fff", // Màu nền mặc định
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center", // Căn giữa hình ảnh
    alignItems: "center", // Căn giữa hình ảnh
  },
  activeContainer: {
    backgroundColor: Colors.primary,
  },
  itemText: {
    width: "100%",
    marginTop: 5,
    textAlign: "center",
    color: "#000", // Màu chữ mặc định
    fontFamily: "outfit-medium",
  },
  activeText: {
    color: "#fff", // Màu chữ khi active
  },
});

export default CategoryItem;
