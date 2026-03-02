import { Lock, Activity, ShieldCheck } from "lucide-react";

export function LGPDSettings() {
    return (
        <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 max-w-4xl w-full overflow-hidden">
            {/* Banner LGPD */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 md:mb-10 p-4 sm:p-6 bg-[#f0fdf4] rounded-2xl border border-emerald-100/50">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-[#065f46] leading-[28px]">
                        Sua Clínica está Protegida
                    </h2>
                    <p className="text-[14px] text-emerald-800 font-medium mt-1 leading-relaxed">
                        O OdontoFlow segue rigorosamente as diretrizes da Lei Geral de Proteção de Dados (LGPD). Todos os dados sensíveis dos pacientes são criptografados e o acesso é auditado.
                    </p>
                </div>
            </div>

            <h3 className="text-[16px] font-bold text-slate-800 mb-4">
                Controle de Privacidade
            </h3>

            <div className="flex flex-col gap-4">
                {/* Setting 1 */}
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-[#f8fafc]">
                    <div className="flex gap-4 items-center">
                        <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                            <p className="text-[14px] font-bold text-slate-700">
                                Criptografia de Ponta-a-Ponta
                            </p>
                            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
                                Ativado para todos os prontuários e exames.
                            </p>
                        </div>
                    </div>

                    {/* Switch via CSS */}
                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-teal-500 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </div>
                </div>

                {/* Setting 2 */}
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-[#f8fafc]">
                    <div className="flex gap-4 items-center">
                        <Activity className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                            <p className="text-[14px] font-bold text-slate-700">
                                Logs de Auditoria
                            </p>
                            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
                                Registrar quem acessou cada dado de paciente.
                            </p>
                        </div>
                    </div>

                    {/* Switch via CSS */}
                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-teal-500 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
