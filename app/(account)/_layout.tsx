import React, { useEffect, useState } from "react";
import { Stack} from "expo-router";
import ProtectedRoute from "@/components/Protected/ProtectedRoute";

const AccountLayout = () => {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="address" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        <Stack.Screen name="personaInfor" options={{ headerShown: false }} />
        <Stack.Screen name="reviews" options={{ headerShown: false }} />
        <Stack.Screen name="wishlist" options={{ headerShown: false }} />
        <Stack.Screen name="changePassword" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
};

export default AccountLayout;
