"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CaseDisplay {
    id: string;
    title: string;
    client: string;
    date: string;
}

export default function CasesPage() {
    const [cases, setCases] = useState<CaseDisplay[]>([]);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching cases:", error);
        } else {
            const mappedData = (data || []).map((c: any) => ({
                id: c.id,
                title: c.title,
                client: c.client_name || "",
                date: new Date(c.project_date || c.created_at).toLocaleDateString('pt-BR')
            }));
            setCases(mappedData);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este case?")) {
            const { error } = await supabase.from("cases").delete().eq("id", id);
            if (error) {
                console.error("Error deleting case:", error);
                alert("Erro ao excluir case");
            } else {
                setCases(cases.filter((item) => item.id !== id));
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Cases</h1>
                <Link
                    href="/cases/new"
                    className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Case
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950">
                <table className="min-w-full divide-y divide-zinc-900">
                    <thead className="bg-zinc-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Título
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Data
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {cases.map((item) => (
                            <tr key={item.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                    {item.title.split(' ').slice(0, 3).join(' ')}
                                    {item.title.split(' ').length > 3 ? '...' : ''}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                    {item.client}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                    {item.date}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={`/cases/${item.id}`}
                                        className="mr-4 text-zinc-400 hover:text-primary transition-colors"
                                    >
                                        <Edit className="inline h-4 w-4" />
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
                {cases.length === 0 && (
                    <div className="p-6 text-center text-zinc-500">
                        Nenhum case encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
