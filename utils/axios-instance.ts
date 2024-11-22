import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { BACKEND_URL } from "@/constants/Enviroment";
import { callRefreshToken } from "../services/api-call";

// 1. Tạo một Axios instance với cấu hình cơ bản
const instance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Hàm lưu/xóa và lấy `accessToken` từ AsyncStorage
export const setAccessToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem("accessToken", token); // Lưu token
  } else {
    await AsyncStorage.removeItem("accessToken"); // Xóa token
  }
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken"); // Lấy token
};

// 3. Hàm xử lý refresh token
const handleRefreshToken = async () => {
  await setAccessToken(null); // Xóa accessToken cũ
  try {
    const res = await callRefreshToken();
    const newAccessToken = res.data.accessToken;
    await setAccessToken(newAccessToken); // Lưu token mới
    return newAccessToken;
  } catch (error) {
    await setAccessToken(null);
    Alert.alert("Session Expired", "Please log in again.", [{ text: "OK" }]);
    throw error;
  }
};

// 4. Mở rộng cấu hình request của Axios
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// 5. Interceptor cho yêu cầu để thêm `Authorization` header tự động
instance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 6. Interceptor cho phản hồi để tự động refresh token nếu gặp lỗi 401
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Kiểm tra lỗi 401 và thực hiện refresh token nếu chưa thử lại
    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= 2) {
        try {
          await setAccessToken(null);
          const newAccessToken = await handleRefreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // Gửi lại yêu cầu với token mới
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
          Alert.alert("Session Expired", "Please log in again.", [
            { text: "OK" },
          ]);
          return Promise.reject(refreshError);
        }
      } else {
        console.error("Refresh token failed after 2 attempts");
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "OK" },
        ]);
        await setAccessToken(null); // Xóa token khi thử lại thất bại
        return error.response || Promise.reject(error);
      }
    }
    return Promise.reject(error); // Trả về lỗi cho các trường hợp khác
  }
);

export default instance;
