import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true); // Trạng thái loading cho lần đầu kiểm tra
  const [isReady, setIsReady] = useState(false); // Trạng thái để đảm bảo layout đã được mount
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    // Đảm bảo layout đã được mount trước khi điều hướng
    setIsReady(true);
  }, []); // Chạy một lần khi component được mount

  useEffect(() => {
    if (isReady) {
      if (!isLoggedIn) {
        router.replace("/login");
      } else {
        setLoading(false); // Nếu đã đăng nhập, dừng loading
      }
    }
  }, [isLoggedIn, isReady, router]); // Chạy lại khi isLoggedIn thay đổi hoặc layout đã sẵn sàng

  if (loading || !isReady) {
    return <Loading />; // Hiển thị Loading nếu chưa kiểm tra xong hoặc layout chưa mount
  }

  return children; // Hiển thị nội dung bảo vệ nếu đã đăng nhập
};

export default ProtectedRoute;
