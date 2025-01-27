"use client";

import { useUserStore } from "@/application/states/userStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClientComponentClient();
    const { setUser, resetUser, hasHydrated } = useUserStore((state) => state);

    useEffect(() => {
        if (!hasHydrated) return;

        const restoreSession = async () => {
            const { data: sessionData, error } =
                await supabase.auth.getSession();

            if (error || !sessionData?.session) {
                console.error(
                    "세션 복원 실패: ",
                    error?.message || "세션 없음"
                );
                resetUser();
                return;
            }

            const user = sessionData.session.user;
            if (user) {
                const kakaoId = user.user_metadata?.provider_id || "";
                const name = user.user_metadata?.name || "";

                console.log("세션 복원 성공: ", { kakaoId, name });
                setUser(kakaoId, name, "");
            }
        };
        restoreSession();
    }, [supabase, setUser, resetUser]);

    return <>{children}</>;
}
