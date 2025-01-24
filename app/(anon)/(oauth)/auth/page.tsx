"use client";

// import { signIn, useSession } from "next-auth/react";
import { Container, KakaoButton, LogoContainer } from "./page.styles";
import { useUserStore } from "@/application/states/userStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignUp() {
    const setUser = useUserStore((state) => state.setUser);

    const handleSignIn = async (event: React.MouseEvent) => {
        event.preventDefault();
        const supabase = createClientComponentClient();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `http://localhost:3000/auth/setNickname`,
            },
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

            setUser(kakaoId, name, "");
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
