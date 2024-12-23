import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar/TabBar";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="cart2" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabLayout;
