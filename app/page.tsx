"use client";

import ProtectedRoute from "@/components/user/ProtectedRoutes";

export default function Home() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Miking</h1>
            </div>
        </ProtectedRoute>
    );
}
