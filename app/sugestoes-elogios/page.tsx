"use client";

import { useState, useEffect } from "react";
import { Trash2, MessageSquare, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Modal } from "@/components/Modal";

interface SugestaoElogio {
    id: string;
    usuario_identificado: boolean;
    created_at: string;
    tipo: string;
    nome?: string;
    mensagem: string;
}

export default function SugestoesElogiosPage() {
    const [items, setItems] = useState<SugestaoElogio[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<SugestaoElogio | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("ouvidoria_elogios_sugestoes")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching items:", error);
            } else {
                setItems(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este item?")) {
            const { error } = await supabase
                .from("ouvidoria_elogios_sugestoes")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Error deleting item:", error);
                alert("Erro ao excluir item");
            } else {
                setItems(items.filter((item) => item.id !== id));
            }
        }
    };

    const getTypeColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case "sugestão":
            case "sugestao":
                return "bg-blue-100 text-blue-800";
            case "elogio":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-8 w-8" />
                    Sugestões e Elogios
                </h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950">
                <table className="min-w-full divide-y divide-zinc-900">
                    <thead className="bg-zinc-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Identificação
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Mensagem
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(
                                                item.tipo
                                            )}`}
                                        >
                                            {item.tipo}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                        {new Date(item.created_at).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                                        {item.usuario_identificado ? (
                                            <span className="font-medium text-white">{item.nome}</span>
                                        ) : (
                                            <span className="italic text-zinc-500">Anônimo</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-300 max-w-md truncate" title={item.mensagem}>
                                        {item.mensagem}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="mr-3 text-zinc-400 hover:text-blue-500 transition-colors"
                                            title="Ver detalhes"
                                        >
                                            <Eye className="inline h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="inline h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title="Detalhes"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-400">Tipo</label>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(
                                        selectedItem.tipo
                                    )}`}
                                >
                                    {selectedItem.tipo}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-400">Data e Hora</label>
                            <p className="mt-1 text-zinc-200">
                                {new Date(selectedItem.created_at).toLocaleString("pt-BR")}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-400">Identificação</label>
                            <p className="mt-1 text-zinc-200">
                                {selectedItem.usuario_identificado ? selectedItem.nome : "Anônimo"}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-400">Mensagem</label>
                            <div className="mt-1 rounded-lg bg-zinc-900 p-3 text-sm text-zinc-200 whitespace-pre-wrap">
                                {selectedItem.mensagem}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
