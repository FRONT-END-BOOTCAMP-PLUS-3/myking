"use client";

import { Container, KakaoButton, LogoContainer } from "./page.styles";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignUp() {
    const supabase = createClientComponentClient();

    const handleSignIn = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "kakao",
                options: {
                    redirectTo: "http://localhost:3000/auth/callback",
                },
            });

            if (error) {
                console.error("로그인 실패: ", error.message);
                return;
            }

            console.log("로그인 성공: ", data.url);
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
