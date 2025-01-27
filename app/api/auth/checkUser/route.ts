import { UserRepository } from "@/domain/repositories/UserRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export async function POST(request: Request) {
    try {
        const { kakaoId } = await request.json();
        console.log("kakao id: ", kakaoId);

        if (!kakaoId) {
            return new Response("Kakao ID is required", { status: 400 });
        }

        const userRepository: UserRepository = new SbUserRepository();
        const existingUser = await userRepository.findById(kakaoId);

        console.log("Existing User: ", existingUser);

        if (existingUser) {
            return new Response(JSON.stringify({ exists: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ exists: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error in POST /api/auth/checkUser: ", error);
        return new Response(`오류 발생: ${error.message}`, { status: 500 });
    }
}
