"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserStore } from "@/application/states/userStore";

export default function AuthCallback() {
    const supabase = createClientComponentClient();
    const { setUser } = useUserStore((state) => state);
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data: sessionData, error } =
                    await supabase.auth.getSession();

                if (error || !sessionData?.session) {
                    console.error(
                        "세션 가져오기 실패: ",
                        error?.message || "세션이 없습니다."
                    );
                    alert(
                        "로그인 세션을 확인할 수 없습니다. 다시 시도해주세요."
                    );
                    router.push("/auth");
                    return;
                }

                const user = sessionData.session.user;
                if (!user) {
                    console.error("유저 정보가 없습니다.");
                    alert("유저 정보를 확인할 수 없습니다.");
                    router.push("/auth");
                    return;
                }

                const kakaoId = user.user_metadata?.provider_id || "";
                const name = user.user_metadata?.name || "";
                setUser(kakaoId, name, "");

                const response = await fetch("/api/auth/checkUser", {
                    method: "POST",
                    body: JSON.stringify({ kakaoId }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error("사용자 확인 실패:", await response.text());
                    alert("사용자 확인 중 오류가 발생했습니다.");
                    router.push("/");
                    return;
                }

                const result = await response.json();
                console.log("사용자 확인 결과: ", result);

                if (result.exists) {
                    router.push("/");
                } else {
                    router.push("/auth/setNickname");
                }
            } catch (error: any) {
                console.error("로그인 처리 중 오류 발생: ", error);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
                router.push("/");
            }
        };

        handleAuthCallback();
    }, [supabase, router, setUser]);

    return <div>로그인 처리 중...</div>;
}
