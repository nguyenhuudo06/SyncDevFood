import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import React from "react";

const CategoryItem = () => {
  const categoryList = [
    {
      name: "Home",
      thumbnail:
        "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png",
    },
    {
      name: "Food",
      thumbnail:
        "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png",
    },
    {
      name: "Book",
      thumbnail:
        "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png",
    },
    {
      name: "News",
      thumbnail:
        "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png",
    },
  ];

  return (
    <View>
      <FlatList
        style={{ paddingVertical: 10 , paddingHorizontal: 2}}
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: 10 }}>
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>
            <Text
              style={styles.itemText}
              numberOfLines={1}
              ellipsizeMode="tail"  
            >
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 78,
    height: 80,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  itemText: {
    marginTop: 5,
    textAlign: "center",
    maxWidth: 80, // Giới hạn chiều rộng cho tên danh mục
    overflow: "hidden",
  },
});

export default CategoryItem;
