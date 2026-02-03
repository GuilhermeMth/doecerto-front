import { api } from "@/services/api";

interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export async function login(data: LoginDTO): Promise<void> {
  await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
