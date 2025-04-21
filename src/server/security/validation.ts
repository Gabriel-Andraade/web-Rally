import { Users } from "../types/user";

export const validateUser = (DBUser: Users): string | null => {
  if (!DBUser.email || !DBUser.password || !DBUser.cpf || !DBUser.name)
    return "E-mail, senha, CPF e nome são obrigatórios";
  if (!DBUser.email.includes("@")) return "E-mail inválido";
  if (DBUser.password.length < 8)
    return "A senha deve ter pelo menos 8 caracteres";
  if (!isValidCPF(DBUser.cpf)) return "CPF inválido";
  return null;
};

export const isBlacklistedCPF = (cpf: string): string | null => {
  if (cpf === "000.000.000-00") return "CPF inválido";
  if (cpf === "111.111.111-11") return "CPF inválido";
  if (cpf === "222.222.222-22") return "CPF inválido";
  if (cpf === "333.333.333-33") return "CPF inválido";
  if (cpf === "444.444.444-44") return "CPF inválido";
  if (cpf === "555.555.555-55") return "CPF inválido";
  if (cpf === "666.666.666-66") return "CPF inválido";
  if (cpf === "777.777.777-77") return "CPF inválido";
  if (cpf === "888.888.888-88") return "CPF inválido";
  if (cpf === "999.999.999-99") return "CPF inválido";
  return null;
};

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index++) {
    sum += parseInt(cpf.charAt(index)) * (10 - index);
  }

  let check1 = (sum * 10) % 11;
  if (check1 === 10 || check1 === 11) check1 = 0;
  if (check1 !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let index = 0; index < 10; index++) {
    sum += parseInt(cpf.charAt(index)) * (11 - index);
  }

  let check2 = (sum * 10) % 11;
  if (check2 === 10 || check2 === 11) check2 = 0;
  if (check2 !== parseInt(cpf.charAt(10))) return false;

  return true;
};
