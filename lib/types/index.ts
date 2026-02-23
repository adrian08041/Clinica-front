export interface Patient {
    id: number | string;
    name: string;
    status: 'Ativo' | 'Pendente' | 'Inativo';
    cpf: string;
    phone: string;
    lastVisit: string;
    insurance: string;
    tags: string[];
    avatar: string;
}
