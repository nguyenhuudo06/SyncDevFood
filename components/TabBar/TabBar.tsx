import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = Colors.primary;
  const grayColor = Colors.gray;
  const focusBg = Colors.primary_10;
  const cartCount = useSelector(
    (state: RootState) => state.order.carts.length || 0
  );

  const icons = {
    home: (props: any) => (
      <>
        <Entypo name="home" size={24} color={grayColor} {...props} />
      </>
    ),
    search: (props: any) => (
      <FontAwesome name="search" size={24} color={grayColor} {...props} />
    ),
    cart2: (props: any) => (
      // <Entypo name="shopping-cart" size={24} color={grayColor} {...props} />
      <View>
        <Entypo name="shopping-cart" size={24} color={grayColor} {...props} />
        <View
          style={{
            position: "absolute",
            top: -6,
            right: -20,
            width: 30,
            height: 20,
            backgroundColor: "rgba(232, 17, 63, 0.87)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: Spacing * 2,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "outfit-regular",
              fontSize: 11,
            }}
          >
            {cartCount}
          </Text>
        </View>
      </View>
    ),
    profile: (props: any) => (
      <FontAwesome name="user" size={24} color={grayColor} {...props} />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={{
              ...styles.tabbarItem,
              backgroundColor: isFocused ? focusBg : "transparent",
            }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icons[route.name]({
                color: isFocused ? primaryColor : grayColor,
              })}
              {/* {isFocused && (
                <Text
                  style={{
                    fontSize: FontSize.small,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    color: "#000",
                    marginLeft: Spacing * 0.8,
                  }}
                >
                  {route.name}
                </Text>
              )} */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 8,
    overflow: "hidden",
    borderRadius: 22,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    gap: 4,
    width: "100%",
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    gap: 4,
    backgroundColor: "blue",
    padding: 9,
    borderRadius: 12,
  },
});

export default TabBar;
