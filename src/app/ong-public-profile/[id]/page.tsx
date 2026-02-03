"use client";

import { use, useEffect, useState } from "react";
import OngPublicProfile from "@/components/specific/Ong-Public-Profile/ong-public-profile";
import { getOngById, Ong } from "@/services/ongs.service";
import { ongs as staticOngs } from "@/data/ongs";

export const dynamic = "force-dynamic";

export default function OngPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ong, setOng] = useState<Ong | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true; // Evita atualizar estado em componente desmontado

    async function load() {
      setLoading(true);
      try {
        const ongId = Number(id);
        const data = await getOngById(ongId);

        if (!isMounted) return;

        if (data) {
          console.log("Dados recebidos do Service:", data); // Debug para ver se o nome/logo estão aqui
          setOng(data);
        } else {
          // Fallback para dados estáticos
          const staticData = staticOngs.find((o) => o.id === ongId);
          if (staticData) {
            setOng({
              ...staticData,
              mission: staticData.mission || staticData.description || "Missão não informada",
              since: staticData.since || staticData.years || 2024,
              impactedPeople: staticData.impactedPeople || staticData.donations || 0,
              logo: staticData.logo || `https://placehold.co/400x400/6B21A8/FFF?text=O`,
              banner: staticData.banner || "https://placehold.co/1200x400/F3F4F6/9CA3AF?text=DoeCerto"
            } as Ong);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar página de perfil:", err);
        setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Buscando perfil da ONG...</p>
        </div>
      </div>
    );
  }

  if (error || !ong) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">ONG não encontrada</h1>
          <p className="text-gray-500 mt-2 mb-6">O perfil solicitado pode estar indisponível no momento.</p>
          <button onClick={() => window.location.href = '/home'} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return <OngPublicProfile ong={ong} />;
}