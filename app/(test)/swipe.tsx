import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ItemBox = (props) => {
  // Hàm cho swipe bên phải
  const rightSwipe = (progress, dragX) => {
    // Giới hạn kéo để không vượt quá chiều rộng của deleteBox
    const maxSwipeWidth = 100; // Đặt chiều rộng tối đa của deleteBox
    const translateX = dragX.interpolate({
      inputRange: [-maxSwipeWidth, 0], // Giới hạn dragX từ -100 đến 0
      outputRange: [0, -maxSwipeWidth], // Chuyển động từ 0 đến chiều rộng của deleteBox
      extrapolate: "clamp", // Dừng lại khi vượt quá giới hạn
    });
    const scale = dragX.interpolate({
      inputRange: [-maxSwipeWidth, 0],
      outputRange: [1, 0],
      extrapolate: "clamp", // Dừng lại khi vuốt quá xa
    });

    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{ transform: [{ scale: scale }] }}>
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={rightSwipe}>
      {" "}
      {/* Cập nhật thành renderRightActions */}
      <View style={styles.container}>
        <Text>My name i sdgsdgsd gs</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Kích thước tối đa của deleteBox
    height: 80,
  },
  container: {
    height: 80,
    width: SCREEN_WIDTH,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 16,
  },
  seperatorLine: {
    height: 1,
    backgroundColor: "black",
  },
});

import { useState } from "react";
import { SafeAreaView, FlatList } from "react-native";

const data = [
  { id: "1", name: "A" },
  { id: "2", name: "B" },
  { id: "3", name: "C" },
  { id: "11", name: "A" },
  { id: "23", name: "B" },
  { id: "34", name: "C" },
];

const App = () => {
  const [lists, setLists] = useState(data);

  const deleteItem = (index) => {
    const arr = [...lists];
    arr.splice(index, 1);
    setLists(arr);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={lists}
        renderItem={({ item, index }) => {
          return <ItemBox data={item} handleDelete={() => deleteItem(index)} />;
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.seperatorLine}></View>;
        }}
      />
    </View>
  );
};

export default App;
