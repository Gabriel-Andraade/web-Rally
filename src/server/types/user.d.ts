export interface Users {
  id: number;
  name: string;
  lastName: string;
  email: string;
  number: string;
  cpf: string;
  password: string;
  confirm: string;
  verificationCode?: string;
  isVerified?: boolean;
}

export type { Users };
