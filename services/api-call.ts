import { OrderInformation } from "@/app/(task)/checkout";
import instance from "@/utils/axios-instance";
import axios from "axios";
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
    `/api/v1/auth/guest/get-all-dishes?pageNo=${pageNumber}&pageSize=8&sortBy=dishName&sortDir=asc`
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
  return instance.get(
    `/api/v1/client/order/get-order-by-user-id?userId=${userId}&${query}`
  );
};

export const callGetWishListById = async (userId: string) => {
  return instance.get(
    `/api/v1/client/wishlist/get-wishlist-by-user-id?userId=${userId}`
  );
};

export const callProvincialService = async () => {
  return axios.get("https://api.mysupership.vn/v1/partner/areas/province");
};

export const callDistrictService = async (code: string) => {
  return axios.get(
    `https://api.mysupership.vn/v1/partner/areas/district?province=${code}`
  );
};

export const callCommuneService = async (code: string) => {
  return axios.get(
    `https://api.mysupership.vn/v1/partner/areas/commune?district=${code}`
  );
};

export const callAddAddress = (
  street: string,
  country: string,
  city: string,
  addressType: string,
  state: string,
  commune: string,
  phoneNumber: string,
  userId: string | null
) => {
  return instance.post("/api/v1/client/address/add", {
    street,
    country,
    city,
    addressType,
    state,
    commune,
    phoneNumber,
    userId,
  });
};

export const callUpdateAddress = (
  street: string,
  country: string,
  city: string,
  addressType: string,
  state: string,
  commune: string,
  phoneNumber: string,
  userId: string | null,
  id: string | null
) => {
  return instance.put("/api/v1/client/address/update", {
    street,
    country,
    city,
    addressType,
    state,
    commune,
    phoneNumber,
    userId,
    id,
  });
};

export const callGetAllOffers = async () => {
  return instance.get(`/api/v1/auth/guest/get-all-offers`);
};

export const callGetBlogs = async (query: string) => {
  return instance.get(`/api/v1/auth/guest/get-all-blogs?${query}`);
};

export const callUpdateAvatar = (file: FormData) => {
  return instance.put("/api/v1/client/user/update-avatar", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const callGetReviewsByDishId = async (dishId: string, query: string) => {
  return instance.get(
    `/api/v1/auth/guest/get-all-reviews-by-dish?dishId=${dishId}&${query}`
  );
};

export const callAllDishToSearch = async () => {
  return instance.get(`/api/v1/dashboard/dish/get-all-dishes-to-search`);
};

export const callAddDishToWishList = async (
  dishId: string | undefined,
  userId: string | null
) => {
  return instance.post(
    `/api/v1/client/wishlist/add-dish-to-wishlist?dishId=${dishId}&userId=${userId}`
  );
};

export const callDeleteDishFromWishList = async (
  dishId: string | undefined,
  userId: string | null
) => {
  return instance.delete(
    `/api/v1/client/wishlist/remove-dish-from-wishlist?dishId=${dishId}&userId=${userId}`
  );
};

export const callCreateReview = async (
  dishId: string,
  rating: number,
  review: string,
  userId: string | null
) => {
  return instance.post(`/api/v1/client/review/create-review`, {
    dishId: dishId,
    rating: rating,
    review: review,
    userId: userId,
  });
};

export const callGetReviewsByUserId = async (userId: string, query: string) => {
  return instance.get(
    `/api/v1/client/review/get-all-reviews-by-user-id?userId=${userId}&${query}`
  );
};

export const callCancelOrderByOrderId = async (orderId: string) => {
  return instance.put(`/api/v1/client/order/cancel-order?orderId=${orderId}`);
};

export const callGetBlogById = async (blogId: string) => {
  return instance.get(`/api/v1/auth/guest/get-blog-by-id?blogId=${blogId}`);
};

export const callGetAllCategories = async () => {
  return instance.get(
    `/api/v1/auth/guest/get-all-categories?sortBy=createdAt&sortDir=asc`
  );
};
