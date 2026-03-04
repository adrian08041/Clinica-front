import { InfoSection } from "@/components/login/info-section";
import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fafbfc]">
      {/* Left Column - Visual Info (Hidden on Mobile) */}
      <section className="hidden lg:flex w-[60%] xl:w-[60%] lg:w-[50%] min-h-screen">
        <InfoSection />
      </section>

      {/* Right Column - Form */}
      <section className="flex-1 w-full bg-white flex flex-col justify-center items-center lg:items-start px-6 sm:px-12 md:px-16 lg:pl-[96px] lg:pr-12 lg:shadow-[-25px_0_50px_-15px_rgba(0,0,0,0.1)] z-10">
        <LoginForm />
      </section>
    </main>
  );
}
