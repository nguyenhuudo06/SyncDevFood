import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading/Loading";

export default function Index() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Đảm bảo layout đã được mount trước khi chuyển hướng
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      router.push("/(tabs)/home");
    }
  }, [ready, router]);

  return <Loading />;
}
