"use client";

import { useRouter } from "next/navigation";
import { Container, KakaoButton, LogoContainer } from "./page.styles";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserStore } from "@/application/states/userStore";

export default function SignUp() {
    const supabase = createClientComponentClient();
    const { setUser } = useUserStore((state) => state);
    const router = useRouter();

    const handleSignIn = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "kakao",
            });

            if (error) {
                console.error("로그인 실패: ", error.message);
                return;
            }

            console.log("로그인 성공: ", data.url);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const kakaoId = user.id || "";
                const name = user.user_metadata?.name || "";

                console.log("사용자 정보: ", { kakaoId, name });
                setUser(kakaoId, name, "");

                const response = await fetch("/api/auth/checkUser", {
                    method: "POST",
                    body: JSON.stringify({ kakaoId: user.id }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error("사용자 확인 실패:", await response.text());
                    alert("사용자 확인 중 오류가 발생했습니다.");
                    return;
                }

                const result = await response.json();
                console.log("사용자 확인 결과: ", result);

                if (result.exists) {
                    console.log("메인으로 이동");
                    router.push("/");
                } else {
                    router.push("/auth/setNickname");
                }
            }
        } catch (error: any) {
            console.error("로그인 중 오류 발생: ", error);
            alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Container>
            <LogoContainer>
                <h4>나만의 하이킹 메이트</h4>
                <img src="/logos/logo.png" alt="logo" />
            </LogoContainer>

            <KakaoButton onClick={handleSignIn}>카카오 로그인</KakaoButton>
        </Container>
    );
}
