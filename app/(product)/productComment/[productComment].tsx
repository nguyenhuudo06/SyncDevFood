import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/Material/BackButton";
import Colors from "@/constants/Colors";
import { useRoute } from "@react-navigation/native";
import Spacing from "@/constants/Spacing";
import Comment from "@/components/Comment/Comment";

const ProductComment = () => {
  const route = useRoute();
  const { productComment } = route.params;

  return (
    <View style={styles.scrollView}>
      <BackButton />
      <View style={{ padding: Spacing, flex: 1 }}>
        <Comment dishId={productComment} />
      </View>
    </View>
  );
};

export default ProductComment;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
