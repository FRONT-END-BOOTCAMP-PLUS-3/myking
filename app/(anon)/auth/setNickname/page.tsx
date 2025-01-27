"use client";

import ProtectedRoutes from "@/components/user/ProtectedRoutes";
import {
    Form,
    Header,
    Main,
    NicknameContainer,
    ProfileImageContainer,
    SignUpButton,
} from "./page.styles";
import { useUserStore } from "@/application/states/userStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SetNickname() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { kakaoId, name, nickname, setUser } = useUserStore((state) => state);
    const [inputNickname, setInputNickname] = useState("");

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const kakaoId = session.user.id || "";
                    const name = session.user.user_metadata.name || "";

                    setUser(kakaoId, name, nickname);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase, setUser]);

    const handleNicknameChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setInputNickname(event.target.value);
    };

    const handleSetNickname = async (event: React.FormEvent) => {
        event.preventDefault();

        setUser(kakaoId, name, inputNickname);

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                body: JSON.stringify({
                    kakaoId,
                    name,
                    nickname: inputNickname,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("닉네임 설정 실패");
            }

            const result = await response.json();

            if (response.ok) {
                if (response.status === 201) {
                    console.log("닉네임 설정 성공:", result.message);
                    router.push("/");
                } else if (
                    response.status === 200 &&
                    result.message === "user already exists"
                ) {
                    console.log("이미 등록된 사용자:", result.message);
                    router.push("/");
                } else {
                    throw new Error(
                        result.message || "알 수 없는 오류가 발생했습니다."
                    );
                }
            } else {
                if (
                    response.status === 400 &&
                    result.message === "nickname already exists"
                ) {
                    alert("이미 존재하는 닉네임입니다.");
                } else {
                    throw new Error(result.message || "오류가 발생했습니다.");
                }
            }

            router.push("/");
        } catch (error: any) {
            console.error("닉네임 설정 중 오류 발생", error);
            alert("닉네임 설정 중 문제가 발생했습니다. 다시 시도해주세요");
        }
    };

    return (
        <ProtectedRoutes>
            <Header>
                <img src="/logos/logo.png" alt="logo" />
            </Header>
            <Main>
                <Form onSubmit={handleSetNickname}>
                    <ProfileImageContainer>
                        <img
                            src="/images/member_default.svg"
                            alt="member_default"
                        />
                        <h4>프로필 수정</h4>
                    </ProfileImageContainer>
                    <NicknameContainer>
                        <h5>
                            닉네임 <span>*</span>
                        </h5>
                        <input
                            type="text"
                            placeholder="닉네임 입력"
                            maxLength={20}
                            minLength={2}
                            onChange={handleNicknameChange}
                        />
                    </NicknameContainer>
                    <SignUpButton type="submit">마이킹 시작하기</SignUpButton>
                </Form>
            </Main>
        </ProtectedRoutes>
    );
}
