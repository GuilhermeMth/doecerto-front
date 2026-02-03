// src/services/ongs.service.ts
import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
  pixKey?: string;
  user?: {
    name: string;
  };
}

export async function getVerifiedOngs(): Promise<Ong[]> {
  const res = await api<any[]>("/catalog");

  const all = res.data.flatMap(s => s.data);
  return Array.from(new Map(all.map((o: any) => [o.userId, { id: o.userId, name: o.name }])).values());
}

export async function getOngById(id: string): Promise<Ong> {
  const res = await api<Ong>(`/ongs/${id}`);
  return res.data;
  banner: string;         
  logo: string;           
  description?: string;
  phone?: string;
  instagram?: string;
  address?: string;
  distance?: string;
  years?: number;
  donations?: number;
  mission: string;        
  since: number;          
  impactedPeople: number; 
}

const BANNER_PLACEHOLDER = "https://placehold.co/1200x400/F3F4F6/9CA3AF?text=DoeCerto";
const LOGO_PLACEHOLDER = "https://placehold.co/400x400/E5E7EB/9CA3AF?text=ONG";

/**
 * Função de tratamento de imagem robusta
 */
const getValidImage = (url?: string, isBanner = false) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  if (!url || url === "null" || url.trim() === "") {
    return isBanner ? BANNER_PLACEHOLDER : LOGO_PLACEHOLDER;
  }

  if (url.startsWith("/")) {
    return `${API_URL}${url}`;
  }

  return url;
};

export async function getCatalogOngs(offset = 0, limit = 100): Promise<Ong[]> {
  try {
    const res = await api<Array<{ data: any[] }>>(`/catalog?offset=${offset}&limit=${limit}`);
    const sections = res.data || [];
    const allOngs = sections.flatMap((section) => section.data || []);
    
    return allOngs.map((item: any) => ({
      id: item.userId,
      name: item.name || "ONG",
      description: item.bio,
      logo: getValidImage(item.avatarUrl || item.logoUrl),
      banner: getValidImage(item.bannerUrl, true),
      mission: item.bio || "Missão não informada",
      since: 2024,
      impactedPeople: 0
    }));
  } catch (error) {
    return [];
  }
}

export async function getOngById(id: number): Promise<Ong | null> {
  try {
    const res = await api<any>(`/ongs/${id}/profile`);
    const data = res.data;
    
    if (!data) return null;

    // Extração do nome (tentando caminhos diferentes baseado no seu JSON)
    const name = data.ong?.user?.name || data.name || "ONG";

    // DEBUG para você ver no console se a URL da imagem está chegando
    console.log("URL da imagem vinda da API:", data.avatarUrl || data.logoUrl);

    return {
      id: id,
      name: name,
      description: data.bio || data.description || "Sem descrição disponível.",
      phone: data.contactNumber || data.phone,
      instagram: data.websiteUrl || data.instagram,
      address: data.address,
      distance: "Calculando...",
      
      // Tenta pegar avatarUrl ou logoUrl ou qualquer variação
      logo: getValidImage(data.avatarUrl || data.logoUrl || data.ong?.avatarUrl),
      banner: getValidImage(data.bannerUrl || data.ong?.bannerUrl, true),
      
      mission: data.mission || data.bio || "Missão não informada.",
      since: data.since || 2024,
      impactedPeople: data.ong?.numberOfRatings || 0,
    };
  } catch (error) {
    console.error(`Erro no perfil:`, error);
    return null;
  }
}