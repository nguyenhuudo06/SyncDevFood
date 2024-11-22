import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { ReactNode, useEffect } from "react";
import Loading from "../Loading/Loading";
import { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Loading />;
  }

  return children; // Hiển thị nội dung bảo vệ nếu đã đăng nhập
};

export default ProtectedRoute;
