export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  insurance?: string;
  createdAt: string;
  status?: string;
  lastVisit?: string;
  tags?: string[];
  avatar?: string;
}
