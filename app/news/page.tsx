"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsDisplay {
    id: string;
    title: string;
    content: string;
    date: string;
    published: boolean;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsDisplay[]>([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching news:", error);
        } else {
            const mappedData = (data || []).map((n: any) => ({
                id: n.id,
                title: n.title,
                content: typeof n.content_blocks === 'string' ? n.content_blocks : JSON.stringify(n.content_blocks),
                date: new Date(n.created_at).toLocaleDateString('pt-BR'),
                published: true // Default to true
            }));
            setNews(mappedData);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta notícia?")) {
            const { error } = await supabase.from("news").delete().eq("id", id);
            if (error) {
                console.error("Error deleting news:", error);
                alert("Erro ao excluir notícia");
            } else {
                setNews(news.filter((item) => item.id !== id));
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Notícias</h1>
                <Link
                    href="/news/new"
                    className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Notícia
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
                    <tbody className="divide-y divide-zinc-900">
                        {news.map((item) => (
                            <tr key={item.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                    {item.title}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                    {item.date}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${item.published
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-yellow-500/10 text-yellow-500"
                                            }`}
                                    >
                                        {item.published ? "Publicado" : "Rascunho"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={`/news/${item.id}`}
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
                {news.length === 0 && (
                    <div className="p-6 text-center text-zinc-500">
                        Nenhuma notícia encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
