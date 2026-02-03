// src/services/ongs.service.ts
import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
  pixKey?: string;
  description?: string;
  logo?: string;
  banner?: string;
  mission?: string;
  since?: number;
  impactedPeople?: number;
  phone?: string;
  instagram?: string;
  address?: string;
  distance?: string;
  user?: {
  name: string;
  };
}

export async function getVerifiedOngs(): Promise<Ong[]> {
  interface CatalogSection {
    data: Array<{ userId: number; name: string }>;
  }
  const res = await api<CatalogSection[]>("/catalog");

  const all = res.data.flatMap(s => s.data);
  return Array.from(new Map(all.map((o) => [o.userId, { id: o.userId, name: o.name }])).values());
}

const BANNER_PLACEHOLDER = "https://placehold.co/1200x400/F3F4F6/9CA3AF?text=DoeCerto";
const LOGO_PLACEHOLDER = "https://placehold.co/400x400/E5E7EB/9CA3AF?text=ONG";

/**
 * Função de tratamento de imagem robusta
 */
export const getValidImage = (url?: string, isBanner = false) => {
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
  interface CatalogItem {
    userId: number;
    name: string;
    bio?: string;
    avatarUrl?: string;
    logoUrl?: string;
    bannerUrl?: string;
  }
  interface CatalogSection {
    data: CatalogItem[];
  }
  try {
    const res = await api<CatalogSection[]>(`/catalog?offset=${offset}&limit=${limit}`);
    const sections = res.data || [];
    const allOngs = sections.flatMap((section) => section.data || []);
    
    return allOngs.map((item: CatalogItem) => ({
      id: item.userId,
      name: item.name || "ONG",
      description: item.bio,
      logo: getValidImage(item.avatarUrl || item.logoUrl),
      banner: getValidImage(item.bannerUrl, true),
      mission: item.bio || "Missão não informada",
      since: 2024,
      impactedPeople: 0
    }));
  } catch {
    return [];
  }
}

export async function getOngById(id: number): Promise<Ong | null> {
  interface OngProfileResponse {
    name?: string;
    bio?: string;
    description?: string;
    contactNumber?: string;
    phone?: string;
    websiteUrl?: string;
    instagram?: string;
    address?: string;
    avatarUrl?: string;
    logoUrl?: string;
    bannerUrl?: string;
    mission?: string;
    since?: number;
    ong?: {
      user?: { name: string };
      avatarUrl?: string;
      bannerUrl?: string;
      numberOfRatings?: number;
    };
  }
  try {
    const res = await api<OngProfileResponse>(`/ongs/${id}/profile`);
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
  } catch (_error: Error | unknown) {
    console.error(`Erro no perfil:`, _error);
    return null;
  }
}