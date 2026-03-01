import { Plus, UserPlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const teamMembers = [
    {
        name: "Dra. Ana Silva",
        status: "ativo no sistema",
        role: "Administrador",
        avatar: "https://i.pravatar.cc/150?u=ana-silva",
    },
    {
        name: "Dr. Lucas Ferraz",
        status: "ativo no sistema",
        role: "Dentista",
        avatar: "https://i.pravatar.cc/150?u=lucas",
    },
    {
        name: "Mariana Santos",
        status: "ativo no sistema",
        role: "Recepcionista",
        avatar: "https://i.pravatar.cc/150?u=mariana",
    },
];

export function EquipeSettings() {
    return (
        <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm overflow-hidden p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-[20px] font-bold text-slate-900 leading-[28px]">
                        Gestão de Equipe
                    </h2>
                    <p className="text-[14px] text-slate-500 font-medium mt-1">
                        Controle os usuários e níveis de acesso ao sistema.
                    </p>
                </div>
                <Button className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <Table className="w-full text-left min-w-[500px]">
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-slate-500 h-auto">
                                Colaborador
                            </TableHead>
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-slate-500 h-auto">
                                Cargo / Permissão
                            </TableHead>
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-slate-500 w-[100px] text-right h-auto">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member, index) => (
                            <TableRow
                                key={index}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                            >
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-10 h-10 border border-slate-200">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-slate-900">
                                                {member.name}
                                            </span>
                                            <span className="text-[13px] text-slate-500">
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-6 text-[14px] font-medium text-slate-700">
                                    {member.role}
                                </TableCell>
                                <TableCell className="py-4 px-6 text-right">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
