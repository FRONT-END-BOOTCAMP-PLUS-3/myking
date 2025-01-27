"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/application/states/userStore";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, hasHydrated } = useUserStore((state) => state);
    const router = useRouter();

    useEffect(() => {
        if (!hasHydrated) return;

        if (!isLoggedIn) {
            console.log(
                "로그인되지 않은 사용자입니다. 로그인 페이지로 리다이렉트합니다."
            );
            router.push("/auth");
        }
    }, [isLoggedIn, hasHydrated, router]);

    if (!hasHydrated) {
        return null;
    }

    if (!isLoggedIn) {
        return null;
    }

    return <>{children}</>;
}
