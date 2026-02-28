import { Stethoscope } from "lucide-react";
import Image from "next/image";

export function InfoSection() {
  return (
    <div className="relative w-full h-full min-h-screen hidden lg:flex flex-col bg-[#0b4f4a] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1470&auto=format&fit=crop"
          alt="Cadeira de dentista"
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(136.49deg, rgba(0, 150, 137, 0.9) 0%, rgba(0, 95, 90, 0.8) 50%, rgba(11, 79, 74, 0.9) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full justify-between p-8 md:p-12 lg:p-16 w-full max-w-[704px]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-[58px] h-[58px] bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <span className="font-bold text-white text-[30px] tracking-[-0.75px]">
            OdontoFlow
          </span>
        </div>

        {/* Hero Text */}
        <div className="flex flex-col gap-6 w-full max-w-[576px]">
          <h1 className="font-extrabold text-white text-[40px] md:text-[48px] leading-[1.2] md:leading-[60px] whitespace-pre-wrap">
            Tecnologia que transforma sorrisos.
          </h1>
          <p className="font-medium text-[#cbfbf1]/90 text-[18px] md:text-[20px] leading-[28px] md:max-w-[438px]">
            Simplifique a gestão da sua clínica e foque no que importa: o
            cuidado com seus pacientes.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full">
          <p className="font-medium text-[#96f7e4]/60 text-[14px] leading-[20px]">
            © 2026 DentaFlow SaaS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
