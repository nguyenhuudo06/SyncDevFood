import { OrderInformation } from "@/app/(task)/checkout";
import instance from "@/utils/axios-instance";
import { router } from "expo-router";

export const callRegister = (
  email: string,
  password: string,
  fullName: string
) => {
  const data = instance.post("/api/v1/auth/sign-up", {
    email,
    password,
    fullName,
  });
  return data;
};

export const callLogin = async (email: string, password: string) => {
  const response = await instance.post("/api/v1/auth/sign-in", {
    email,
    password,
  });
  return response;
};

export const callProfile = () => {
  return instance.get("/api/v1/client/user/profile");
};

export const callRefreshToken = () => {
  return instance.get("/api/v1/auth/refresh-token");
};

export const callForgotPassword = (params: string) => {
  return instance.get(`/api/v1/auth/forgot-password?email=${params}`);
};

export const callUpdateProfile = (fullName: string, email: string) => {
  return instance.put("/api/v1/client/user/update", { fullName, email });
};

export const callAddress = (userId: string | null) => {
  return instance.get(
    `/api/v1/client/address/get-all-address?userId=${userId}&pageNo=0&pageSize=10&sortBy=createdAt&sortDir=asc`
  );
};

export const callDeleteAddress = (addressId: string) => {
  return instance.delete(`/api/v1/client/address/delete/${addressId}`);
};

export const callAllProduct = async (pageNumber: number) => {
  return instance.get(
    `/api/v1/auth/guest/get-all-dishes?pageNo=${pageNumber}&pageSize=6&sortBy=dishName&sortDir=asc`
  );
};

export const callProductDetail = (productId: string) => {
  return instance.get(`/api/v1/auth/guest/get-dish-by-id/${productId}`);
};

export const callGetAllDishes = async (query: string) => {
  return instance.get(`/api/v1/auth/guest/get-all-dishes?${query}`);
};

export const callGetDishDetail = async (dishId: string) => {
  return instance.get(`/api/v1/auth/guest/get-dish-by-id/${dishId}`);
};

export const callGetAllCouponNotUsedByUserId = async (query: string) => {
  return instance.get(
    `/api/v1/auth/guest/get-all-coupons-not-used-by-user?${query}`
  );
};

interface OrderItem {
  dishId: string;
  quantity: number;
  dishOptionSelectionIds?: string[];
}

export const callCreateOrder = async (orderInformation: OrderInformation) => {
  return instance.post(`/api/v1/client/order/add-new-order`, orderInformation);
};

export const callGeocoding = async (address: string) => {
  return instance.get(
    `/api/v1/client/geocoding/coordinates?address=${address}`
  );
};

export const callCreatePaymentUrl = async (orderId: string) => {
  return instance.get(
    `/api/v1/client/payment/create-payment-url?orderId=${orderId}`
  );
};

export const callProcessPayment = async (orderId: string) => {
  try {
    const paymentUrlResponse = await callCreatePaymentUrl(orderId);
    if (paymentUrlResponse.status === 200 && paymentUrlResponse.data) {
      return paymentUrlResponse.data;
    } else {
      throw new Error("Failed to get payment URL");
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
};

export const callPaymentReturn = async (
  vnp_Amount: string,
  vnp_BankCode: string,
  vnp_BankTranNo: string,
  vnp_CardType: string,
  vnp_OrderInfo: string,
  vnp_PayDate: string,
  vnp_ResponseCode: string,
  vnp_TmnCode: string,
  vnp_TransactionNo: string,
  vnp_TransactionStatus: string,
  vnp_TxnRef: string,
  vnp_SecureHash: string
) => {
  return instance.get(
    `/api/v1/client/payment/return?vnp_Amount=${vnp_Amount}&vnp_BankCode=${vnp_BankCode}&vnp_BankTranNo=${vnp_BankTranNo}&vnp_CardType=${vnp_CardType}&vnp_OrderInfo=${vnp_OrderInfo}&vnp_PayDate=${vnp_PayDate}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_TmnCode=${vnp_TmnCode}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_TransactionStatus=${vnp_TransactionStatus}&vnp_TxnRef=${vnp_TxnRef}&vnp_SecureHash=${vnp_SecureHash}`
  );
};

export const callChangePassword = (
  userId: string | null,
  oldPassword: string | null,
  newPassword: string | null
) => {
  return instance.put("/api/v1/client/user/change-password", {
    userId,
    oldPassword,
    newPassword,
  });
};


export const callGetOrderById = async (userId: string, query: string) => {
  return instance.get(`/api/v1/client/order/get-order-by-user-id?userId=${userId}&${query}`);
};