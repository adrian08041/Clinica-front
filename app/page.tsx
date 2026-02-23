import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Image from 'next/image';
import { CalendarCheck, CheckCircle, DollarSign, Users, TrendingUp, TrendingDown, AlertCircle, CreditCard, Gift, ChevronRight, FileText } from 'lucide-react';

const imgImageMarianaCosta = "https://api.dicebear.com/9.x/avataaars/png?seed=MarianaCosta&backgroundColor=f0f9ff";
const imgImageRicardoMendes = "https://api.dicebear.com/9.x/avataaars/png?seed=RicardoMendes&backgroundColor=ecfdf5";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[32px] w-full max-w-[1267px] mx-auto min-w-[768px] pb-10">

        {/* CARDS HEADER */}
        <div className="grid grid-cols-4 gap-[24px]">

          {/* Card 1 */}
          <div className="bg-white border border-slate-200 border-solid rounded-[14px] p-[25px] flex flex-col gap-[16px] h-[170px] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-500 text-[14px] leading-[20px]">
                Consultas Hoje
              </p>
              <div className="bg-white rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="relative w-full h-[20px] flex items-center justify-center">
                  <CalendarCheck className="w-[20px] h-[20px] text-teal-600" />
                </div>
              </div>
            </div>
            <p className="font-bold text-slate-900 text-[24px] leading-[32px]">
              12
            </p>
            <div className="flex items-center gap-[6px]">
              <div className="bg-green-100 rounded-full h-[20px] px-[8px] flex items-center gap-[4px]">
                <TrendingUp className="w-[12px] h-[12px] text-green-700" />
                <span className="font-semibold text-green-700 text-[12px] leading-[16px]">20%</span>
              </div>
              <span className="font-normal text-slate-400 text-[12px] leading-[16px]">vs período anterior</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 border-solid rounded-[14px] p-[25px] flex flex-col gap-[16px] h-[170px] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-500 text-[14px] leading-[20px]">
                Confirmadas
              </p>
              <div className="bg-white rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="relative w-full h-[20px] flex items-center justify-center">
                  <CheckCircle className="w-[20px] h-[20px] text-teal-600" />
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-[8px]">
              <p className="font-bold text-slate-900 text-[24px] leading-[32px]">
                8/12
              </p>
              <span className="font-medium text-slate-400 text-[14px] leading-[20px]">
                (66%)
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="bg-green-100 rounded-full h-[20px] px-[8px] flex items-center gap-[4px]">
                <TrendingUp className="w-[12px] h-[12px] text-green-700" />
                <span className="font-semibold text-green-700 text-[12px] leading-[16px]">5%</span>
              </div>
              <span className="font-normal text-slate-400 text-[12px] leading-[16px]">vs período anterior</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 border-solid rounded-[14px] p-[25px] flex flex-col gap-[16px] h-[170px] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-500 text-[14px] leading-[20px]">
                Faturamento do Mês
              </p>
              <div className="bg-white rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="relative w-full h-[20px] flex items-center justify-center">
                  <DollarSign className="w-[20px] h-[20px] text-teal-600" />
                </div>
              </div>
            </div>
            <p className="font-bold text-slate-900 text-[24px] leading-[32px]">
              R$ 45.200
            </p>
            <div className="flex items-center gap-[6px]">
              <div className="bg-green-100 rounded-full h-[20px] px-[8px] flex items-center gap-[4px]">
                <TrendingUp className="w-[12px] h-[12px] text-green-700" />
                <span className="font-semibold text-[#096] text-[12px] leading-[16px]">12%</span>
              </div>
              <span className="font-normal text-[#90a1b9] text-[12px] leading-[16px]">vs período anterior</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 border-solid rounded-[14px] p-[25px] flex flex-col gap-[16px] h-[170px] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-500 text-[14px] leading-[20px]">
                Novos Pacientes
              </p>
              <div className="bg-white rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="relative w-full h-[20px] flex items-center justify-center">
                  <Users className="w-[20px] h-[20px] text-teal-600" />
                </div>
              </div>
            </div>
            <p className="font-bold text-slate-900 text-[24px] leading-[32px]">
              15
            </p>
            <div className="flex items-center gap-[6px]">
              <div className="bg-green-100 rounded-full h-[20px] px-[8px] flex items-center gap-[4px]">
                <TrendingUp className="w-[12px] h-[12px] text-green-700" />
                <span className="font-semibold text-green-700 text-[12px] leading-[16px]">este mês</span>
              </div>
              <span className="font-normal text-slate-400 text-[12px] leading-[16px]">vs período anterior</span>
            </div>
          </div>
        </div>

        {/* MAIN SECTIONS */}
        <div className="flex gap-[32px] w-full">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-[32px] flex-1 min-w-[700px]">

            {/* Agenda de Hoje Table */}
            <div className="bg-white border border-slate-200 border-solid rounded-[14px] shadow-sm w-full overflow-hidden">
              <div className="border-b border-slate-200 border-solid h-[77px] px-[24px] flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-[18px] leading-[28px]">
                  Agenda de Hoje
                </h3>
                <button className="font-medium text-teal-600 text-[14px] leading-[20px] transition-colors hover:text-teal-700">
                  Ver Agenda Completa
                </button>
              </div>

              <div className="w-full">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 border-solid flex h-[48.5px]">
                  <div className="w-[107px] px-[24px] py-[16px]"><p className="font-semibold text-slate-500 text-[12px] tracking-[0.6px] uppercase leading-[16px]">Horário</p></div>
                  <div className="w-[206px] px-[24px] py-[16px]"><p className="font-semibold text-slate-500 text-[12px] tracking-[0.6px] uppercase leading-[16px]">Paciente</p></div>
                  <div className="w-[180px] px-[24px] py-[16px]"><p className="font-semibold text-slate-500 text-[12px] tracking-[0.6px] uppercase leading-[16px]">Procedimento</p></div>
                  <div className="w-[156px] px-[24px] py-[16px]"><p className="font-semibold text-slate-500 text-[12px] tracking-[0.6px] uppercase leading-[16px]">Dentista</p></div>
                  <div className="flex-1 px-[24px] py-[16px] pr-[32px]"><p className="font-semibold text-slate-500 text-[12px] text-right tracking-[0.6px] uppercase leading-[16px]">Status</p></div>
                </div>

                {/* Row 1 */}
                <div className="border-b border-slate-100 border-solid flex items-center h-[65px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">08:00</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageMarianaCosta} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Mariana Costa</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Limpeza e Profilaxia</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dra. Ana Silva</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-green-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-green-700 text-[12px]">Confirmado</p></div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="border-b border-slate-100 border-solid flex items-center h-[65px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">09:30</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageRicardoMendes} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Ricardo Mendes</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Restauração Resina</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dra. Ana Silva</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-amber-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-amber-700 text-[12px]">Pendente</p></div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="border-b border-slate-100 border-solid flex items-center h-[65px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">11:00</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageMarianaCosta} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Julia Albuquerque</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Invisalign Follow-up</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dr. Lucas Ferraz</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-green-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-green-700 text-[12px]">Confirmado</p></div>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="border-b border-slate-100 border-solid flex items-center h-[65px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">14:00</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageMarianaCosta} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Carlos Eduardo</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Canal (Endodontia)</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dra. Ana Silva</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-red-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-red-700 text-[12px]">Cancelado</p></div>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="border-b border-slate-100 border-solid flex items-center h-[65px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">15:30</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageRicardoMendes} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Beatriz Santos</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Clareamento Dental</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dr. Lucas Ferraz</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-green-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-green-700 text-[12px]">Confirmado</p></div>
                  </div>
                </div>

                {/* Row 6 */}
                <div className="flex items-center h-[64.5px] hover:bg-slate-50 transition-colors">
                  <div className="w-[107px] px-[24px]"><p className="font-medium text-slate-600 text-[14px]">17:00</p></div>
                  <div className="w-[206px] px-[24px] flex items-center gap-[12px]">
                    <div className="relative rounded-full border border-slate-200 w-[32px] h-[32px] overflow-hidden shrink-0"><Image fill className="object-cover" alt="" src={imgImageMarianaCosta} /></div>
                    <p className="font-semibold text-slate-900 text-[14px]">Fernando Souza</p>
                  </div>
                  <div className="w-[180px] px-[24px]"><p className="font-normal text-slate-600 text-[14px]">Primeira Consulta</p></div>
                  <div className="w-[156px] px-[24px]"><p className="font-normal text-slate-500 text-[14px]">Dra. Ana Silva</p></div>
                  <div className="flex-1 px-[24px] pr-[32px] flex justify-end">
                    <div className="bg-amber-100 border border-transparent border-solid rounded-full px-[11px] py-[4px]"><p className="font-semibold text-amber-700 text-[12px]">Pendente</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-row for Goals and New Record */}
            <div className="flex items-stretch gap-[32px] h-[204px]">
              {/* Metas de Fevereiro */}
              <div className="bg-white border border-slate-200 border-solid rounded-[14px] shadow-sm flex-1 p-[32px] flex flex-col gap-[16px]">
                <h4 className="font-semibold text-slate-900 text-[18px] leading-[28px]">
                  Metas de Fevereiro
                </h4>
                <div className="flex flex-col gap-[16px] w-full mt-[4px]">
                  <div className="flex flex-col gap-[8px] w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-slate-500 text-[12px] leading-[16px]">Meta de Faturamento</span>
                      <span className="font-medium text-teal-600 text-[12px] leading-[16px]">R$ 45k / R$ 60k</span>
                    </div>
                    <div className="bg-slate-100 border border-transparent rounded-full h-[8px] w-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full w-[75%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-slate-500 text-[12px] leading-[16px]">Novos Tratamentos</span>
                      <span className="font-medium text-[#d4a853] text-[12px] leading-[16px]">12 / 20</span>
                    </div>
                    <div className="bg-slate-100 border border-transparent rounded-full h-[8px] w-full overflow-hidden">
                      <div className="bg-[#d4a853] h-full rounded-full w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Novo Prontuario */}
              <div className="bg-gradient-to-b from-teal-600 to-teal-800 rounded-[14px] shadow-md w-[380px] shrink-0 relative overflow-hidden p-[32px] flex flex-col justify-center">
                <FileText className="absolute -right-[14px] top-[92px] w-[128px] h-[128px] opacity-20 pointer-events-none text-white mix-blend-overlay" />
                <h4 className="font-bold text-white text-[20px] leading-[28px] mb-[8px]">
                  Novo Prontuário
                </h4>
                <p className="font-normal text-[rgba(255,255,255,0.8)] text-[14px] leading-[20px] max-w-[280px] mb-[24px]">
                  Inicie o registro clínico de um novo paciente agora mesmo.
                </p>
                <button className="bg-white rounded-[10px] shadow-sm w-[173px] h-[40px] font-bold text-teal-700 text-[14px] flex items-center justify-center transition-transform hover:scale-105">
                  Registrar Paciente
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-[32px] min-w-[380px] w-[380px] shrink-0">

            {/* Alertas Próximos */}
            <div className="bg-white border border-slate-200 border-solid rounded-[14px] shadow-sm overflow-hidden h-[409px] flex flex-col">
              <div className="border-b border-slate-200 border-solid h-[77px] px-[24px] flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-slate-900 text-[18px] leading-[28px]">
                  Alertas Próximos
                </h3>
                <div className="bg-white border border-slate-200 rounded-full px-[8px] py-[2px]">
                  <span className="font-bold text-slate-600 text-[10px] tracking-[0.5px] uppercase">Atenção</span>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] p-[16px] flex-1">
                {/* Alert 1 */}
                <div className="border border-slate-200 border-solid rounded-[10px] p-[12px] pr-[16px] flex gap-[16px] items-center">
                  <div className="bg-amber-100 rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative shrink-0">
                    <AlertCircle className="w-[20px] h-[20px] text-amber-700" />
                  </div>
                  <p className="font-medium text-slate-600 text-[14px] leading-[20px] flex-1">
                    3 pacientes não confirmaram amanhã
                  </p>
                  <ChevronRight className="w-[16px] h-[16px] shrink-0 text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>

                {/* Alert 2 */}
                <div className="border border-slate-200 border-solid rounded-[10px] p-[12px] pr-[16px] flex gap-[16px] items-center">
                  <div className="bg-red-100 rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative shrink-0">
                    <CreditCard className="w-[20px] h-[20px] text-red-700" />
                  </div>
                  <p className="font-medium text-slate-600 text-[14px] leading-[20px] flex-1">
                    2 pagamentos vencidos hoje
                  </p>
                  <ChevronRight className="w-[16px] h-[16px] shrink-0 text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>

                {/* Alert 3 */}
                <div className="border border-slate-200 border-solid rounded-[10px] p-[12px] pr-[16px] flex gap-[16px] items-center">
                  <div className="bg-green-100 rounded-[10px] w-[36px] h-[36px] flex items-center justify-center relative shrink-0">
                    <Gift className="w-[20px] h-[20px] text-green-700" />
                  </div>
                  <p className="font-medium text-slate-600 text-[14px] leading-[20px] flex-1">
                    Aniversariante: João Silva 🎂
                  </p>
                  <ChevronRight className="w-[16px] h-[16px] shrink-0 text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>
              </div>

              <div className="p-[16px] pt-[0]">
                <button className="bg-white border border-slate-200 w-full h-[36px] rounded-[10px] font-semibold text-slate-600 text-[14px] transition-colors hover:bg-slate-50">
                  Ver todas as notificações
                </button>
              </div>
            </div>

            {/* Consultas na Semana Chart */}
            <div className="bg-white border border-slate-200 border-solid rounded-[14px] shadow-sm p-[24px] h-[410px] flex flex-col gap-[32px]">
              <div className="flex justify-between items-center h-[72px]">
                <div className="flex flex-col gap-[4px] justify-center">
                  <h3 className="font-semibold text-slate-900 text-[18px] leading-[28px]">
                    Consultas na Semana
                  </h3>
                  <p className="font-normal text-slate-500 text-[12px] leading-[16px]">
                    Média de 12.5 por dia
                  </p>
                </div>
                <select className="bg-white border border-slate-200 border-solid rounded-[8px] h-[29px] w-[152px] text-[14px] text-slate-500 px-2 outline-none font-medium cursor-pointer">
                  <option>Esta Semana</option>
                  <option>Semana Passada</option>
                </select>
              </div>

              {/* Manual Flex Representation of the Chart using the SVG images */}
              <div className="relative w-full flex-1 min-h-[200px]">
                <div className="absolute inset-0 right-[40px] bottom-[30px]">
                  {/* the 6 bars */}
                  <div className="absolute w-[12%] h-[60%] bottom-0 left-[2%] bg-teal-600 rounded-t-[4px]" />
                  <div className="absolute w-[12%] h-[90%] bottom-0 left-[20%] bg-teal-800 rounded-t-[4px]" />
                  <div className="absolute w-[12%] h-[75%] bottom-0 left-[38%] bg-teal-600 rounded-t-[4px]" />
                  <div className="absolute w-[12%] h-[55%] bottom-0 left-[56%] bg-teal-600 rounded-t-[4px]" />
                  <div className="absolute w-[12%] h-[80%] bottom-0 left-[74%] bg-[#d4a853] rounded-t-[4px]" />
                  <div className="absolute w-[12%] h-[65%] bottom-0 left-[92%] bg-teal-600 rounded-t-[4px]" />
                  {/* Horizontal guides lines */}
                  <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none flex flex-col justify-between">
                    <div className="w-full border-b border-slate-200 border-dashed"></div>
                    <div className="w-full border-b border-slate-200 border-dashed"></div>
                    <div className="w-full border-b border-slate-200 border-dashed"></div>
                    <div className="w-full border-b border-slate-200 border-dashed"></div>
                    <div className="w-full border-b border-slate-200 border-dashed"></div>
                  </div>
                </div>
                {/* Y-axis labels */}
                <div className="absolute right-0 top-0 bottom-[30px] w-[35px] flex flex-col justify-between items-end font-normal text-slate-400 text-[12px]">
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                {/* X-axis labels */}
                <div className="absolute left-0 right-[40px] bottom-0 h-[24px] flex justify-between items-center font-normal text-slate-400 text-[12px] px-[4%]">
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sáb</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
