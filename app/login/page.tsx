import { redirect } from "next/navigation";
import { setAuthCookie, isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  if (isAuthenticated()) {
    redirect("/");
  }

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;

    if (password === process.env.APP_PASSWORD) {
      setAuthCookie();
      redirect("/");
    }

    redirect("/login?error=1");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            I Nostri Viaggi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            TalpyTravels
          </p>
        </div>
        <LoginForm action={login} />
      </div>
    </div>
  );
}
