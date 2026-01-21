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
                    // status_note: d.status_note || "" // Column missing in new table
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
        const { error } = await supabase
            .from("denuncias")
            .update({ status: status })
            .eq("id", resolvedParams.id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar status");
        } else {
            if (denuncia) {
                setDenuncia({ ...denuncia, status: status });
            }
        }
    };

    /* const handleUpdateNote = async (note: string) => {
             // Feature disabled until column exists
             console.log("Update note disabled", note);
             alert("Funcionalidade temporariamente indisponível.");
    }; */

    if (!denuncia) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-2xl font-bold">Detalhes da Denúncia</h1>
            <DenunciaDetail initialData={denuncia} onUpdateStatus={handleUpdateStatus} />
        </div>
    );
}
