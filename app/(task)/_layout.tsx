import React, { useEffect, useState } from "react";
import { router, Slot } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";

const TaskLayout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Tắt header ngay khi layout được mount  
    });
  }, [navigation]);

  return <Slot />;
};

export default TaskLayout;
