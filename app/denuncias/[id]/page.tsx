"use client";

import { use, useState, useEffect } from "react";
import { DenunciaDetail } from "@/components/DenunciaDetail";
import { Denuncia } from "@/lib/data";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ViewDenunciaPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [denuncia, setDenuncia] = useState<Denuncia | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const fetchDenuncia = async () => {
            const { data, error } = await supabase
                .from("denuncias")
                .select("*")
                .eq("id", resolvedParams.id)
                .single();

            if (error) {
                console.error("Error fetching denuncia:", error);
                router.push("/denuncias");
            } else if (data) {
                const d = data;
                setDenuncia({
                    id: d.id,
                    description: d.descricao_fato,
                    status: d.status || "Pendente",
                    date: new Date(d.created_at).toLocaleDateString('pt-BR'),
                    protocolo: d.protocolo,
                    status_note: d.status_note || "",
                    usuario_identificado: d.usuario_identificado,
                    nome: d.nome,
                    email: d.email,
                    tipo_denuncia: d.tipo_denuncia,
                    agentes_envolvidos: d.agentes_envolvidos,
                    data_ocorrencia: d.data_ocorrencia,
                    continua_ocorrendo: d.continua_ocorrendo,
                    unidade_localidade: d.unidade_localidade,
                    setor_gerencia: d.setor_gerencia,
                    contrato_identificado: d.contrato_identificado,
                    lideranca_ciente: d.lideranca_ciente,
                    lideranca_envolvida: d.lideranca_envolvida,
                    tentativa_ocultacao: d.tentativa_ocultacao,
                    existem_testemunhas: d.existem_testemunhas,
                    testemunhas: d.testemunhas,
                    existem_evidencias: d.existem_evidencias,
                    descricao_evidencias: d.descricao_evidencias,
                    valor_financeiro: d.valor_financeiro
                });
            }
        };

        fetchDenuncia();
    }, [resolvedParams.id, router]);

    const handleUpdateStatus = async (status: Denuncia["status"]) => {
        const { data, error } = await supabase
            .from("denuncias")
            .update({ status: status, updated_at: new Date().toISOString() })
            .eq("id", resolvedParams.id)
            .select("id,status");

        if (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar status");
            return;
        } else {
            // If RLS blocks the update, PostgREST may return success but with 0 updated rows.
            if (Array.isArray(data) && data.length === 0) {
                alert("Sem permissão para atualizar esta denúncia (RLS).");
                return;
            }
            if (denuncia) {
                setDenuncia({ ...denuncia, status: status });
            }
        }
    };

    const handleUpdateNote = async (note: string) => {
        const { data, error } = await supabase
            .from("denuncias")
            .update({ status_note: note, updated_at: new Date().toISOString() })
            .eq("id", resolvedParams.id)
            .select("id,status_note");

        if (error) {
            console.error("Error updating status note:", error);
            alert(`Erro ao salvar nota: ${error.message ?? "erro desconhecido"}`);
            throw error;
        }

        // If RLS blocks the update, PostgREST may return success but with 0 updated rows.
        if (Array.isArray(data) && data.length === 0) {
            const msg =
                "O Supabase aceitou a requisição, mas não atualizou nenhuma linha. " +
                "Isso costuma ser RLS/policy bloqueando UPDATE para este usuário.";
            console.warn(msg, { denunciaId: resolvedParams.id });
            alert(msg);
            throw new Error("No rows updated (likely RLS).");
        }

        if (denuncia) {
            // If Supabase returned the updated row, prefer it; otherwise fallback to local note.
            const updatedNote = (data as any)?.[0]?.status_note ?? note;
            setDenuncia({ ...denuncia, status_note: updatedNote });
        }
    };

    if (!denuncia) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-2xl font-bold">Detalhes da Denúncia</h1>
            <DenunciaDetail
                initialData={denuncia}
                onUpdateStatus={handleUpdateStatus}
                onUpdateNote={handleUpdateNote}
            />
        </div>
    );
}
