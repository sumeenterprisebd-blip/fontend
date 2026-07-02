import dynamic from "next/dynamic";

const RegisterPageClient = dynamic(() => import("@/components/auth/RegisterPageClient"), {
  ssr: false,
});

export default function RegisterPage() {
  return <RegisterPageClient />;
}
