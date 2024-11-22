import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho địa chỉ
interface Address {
  id: string;
  phoneNumber: string;
  state: string;
  street: string;
  commune: string;
  district: string | null;
  country: string;
  city: string;
  postalCode: number;
  addressType: string;
  createdAt: string;
  updatedAt: string;
}

// Cập nhật kiểu AuthState
interface AuthState {
  isAuthenticated: boolean;
  user_id: string | null;
  user_name: string | null;
  user_avatar: string | null;
  user_role: {
    id: string;
    name: string;
  } | null;
  email: string | null;
  addresses: Address[];
}

// Khởi tạo state
const initialState: AuthState = {
  isAuthenticated: false,
  user_id: null,
  user_name: null,
  user_avatar: null,
  user_role: null,
  email: null,
  addresses: [],
};

// Tạo slice auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{
      id: string;
      email: string;
      fullName: string;
      avatar: string | null;
      role: { id: string; name: string };
      addresses: Address[];
    }>) {
      state.isAuthenticated = true;
      state.user_id = action.payload.id;
      state.user_name = action.payload.fullName;
      state.user_avatar = action.payload.avatar;
      state.user_role = action.payload.role;
      state.email = action.payload.email;
      state.addresses = action.payload.addresses;
    },
    
    logout(state) {
      // Đặt lại tất cả các thuộc tính về giá trị mặc định
      state.isAuthenticated = false;
      state.user_id = null;
      state.user_name = null;
      state.user_avatar = null;
      state.user_role = null;
      state.email = null;
      state.addresses = []; // Xóa địa chỉ khi đăng xuất
    },
  },
});

// Xuất các action để sử dụng trong component
export const { login, logout } = authSlice.actions;

// Xuất reducer để kết hợp vào Redux store
export default authSlice.reducer;
