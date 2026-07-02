import dynamic from "next/dynamic";

const LoginPageClient = dynamic(() => import("@/components/auth/LoginPageClient"), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginPageClient />;
}


