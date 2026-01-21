"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Denuncia } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function DenunciasPage() {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);

    useEffect(() => {
        fetchDenuncias();
    }, []);

    const fetchDenuncias = async () => {
        // Prefer sorting by created_at (if the column exists); otherwise fallback without server-side ordering.
        const primary = await supabase
            .from("denuncias")
            .select("*")
            .order("created_at", { ascending: false });

        let rows = primary.data;
        let error = primary.error as any;

        if (error) {
            const msg = `${error?.message ?? ""} ${error?.details ?? ""}`.toLowerCase();
            const couldBeMissingCreatedAt = msg.includes("created_at") && (msg.includes("column") || msg.includes("does not exist"));

            console.error("Error fetching denuncias:", error);

            if (couldBeMissingCreatedAt) {
                const fallback = await supabase.from("denuncias").select("*");
                if (fallback.error) {
                    console.error("Fallback fetch denuncias failed:", fallback.error);
                    return;
                }
                rows = fallback.data;
                error = null;
            }
        }

        if (!rows) return;

        // If the table has created_at, order client-side as a safety net.
        const sorted = [...rows].sort((a: any, b: any) => {
            const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
            return bTime - aTime;
        });

        const mappedData = sorted.map((d: any) => ({
            id: d.id,
            description: d.descricao_fato || "Sem descrição",
            status: d.status || "Pendente",
            date: d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : "-",
            protocolo: d.protocolo || "-"
        }));
        setDenuncias(mappedData);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta denúncia?")) {
            const { error } = await supabase.from("denuncias").delete().eq("id", id);
            if (error) {
                console.error("Error deleting denuncia:", error);
                alert("Erro ao excluir denúncia");
            } else {
                setDenuncias(denuncias.filter((item) => item.id !== id));
            }
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from("denuncias")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar status");
        } else {
            setDenuncias(denuncias.map((item) =>
                item.id === id ? { ...item, status: newStatus as any } : item
            ));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pendente":
                return "bg-yellow-100 text-yellow-800";
            case "Em Análise":
                return "bg-blue-100 text-blue-800";
            case "Resolvido":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Denúncias</h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950">
                <table className="min-w-full divide-y divide-zinc-900">
                    <thead className="bg-zinc-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Descrição (Resumo)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {denuncias.map((item) => (
                            <tr key={item.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                    {item.description.length > 50
                                        ? item.description.substring(0, 50) + "..."
                                        : item.description}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                    {item.date}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 border-none focus:ring-0 cursor-pointer ${getStatusColor(
                                            item.status
                                        )}`}
                                    >
                                        <option value="Pendente">Pendente</option>
                                        <option value="Em Análise">Em Análise</option>
                                        <option value="Resolvido">Resolvido</option>
                                    </select>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={`/denuncias/${item.id}`}
                                        className="mr-4 text-zinc-400 hover:text-primary transition-colors"
                                    >
                                        <Eye className="inline h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="inline h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {denuncias.length === 0 && (
                    <div className="p-6 text-center text-zinc-500">
                        Nenhuma denúncia encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
