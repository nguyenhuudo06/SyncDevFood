import React from "react";
import { Slot, Stack } from "expo-router";
import ProtectedRoute from "@/components/Protected/ProtectedRoute";

const OrderLayout = () => {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="order/[orderId]" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
};

export default OrderLayout;
