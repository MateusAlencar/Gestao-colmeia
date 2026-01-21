"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardClient() {
    const [stats, setStats] = useState({
        totalNews: 0,
        publishedNews: 0,
        totalCases: 0,
        publishedCases: 0,
        totalDenuncias: 0,
        resolvedDenuncias: 0,
        analyzingDenuncias: 0,
        pendingDenuncias: 0,
    });
    const [recentActions, setRecentActions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all data in parallel
            const [newsRes, casesRes, denunciasRes] = await Promise.all([
                supabase.from("news").select("*"),
                supabase.from("cases").select("*"),
                supabase.from("denuncias").select("*"),
            ]);

            const newsData = newsRes.data || [];
            const casesData = casesRes.data || [];
            const denunciasData = denunciasRes.data || [];

            // Calculate news stats
            const totalNews = newsData.length;
            const publishedNews = newsData.length; // Assuming all are published

            // Calculate cases stats
            const totalCases = casesData.length;
            const publishedCases = casesData.filter((c: any) => c.is_published).length;

            // Calculate denuncias stats
            const totalDenuncias = denunciasData.length;
            const resolvedDenuncias = denunciasData.filter((d: any) => d.status === "Resolvido").length;
            const analyzingDenuncias = denunciasData.filter((d: any) => d.status === "Em Análise").length;
            const pendingDenuncias = denunciasData.filter((d: any) => d.status === "Pendente").length;

            setStats({
                totalNews,
                publishedNews,
                totalCases,
                publishedCases,
                totalDenuncias,
                resolvedDenuncias,
                analyzingDenuncias,
                pendingDenuncias,
            });

            // Create recent actions
            const actions = [
                ...denunciasData.slice(0, 5).map((d: any) => ({
                    type: 'Denúncia',
                    description: `Protocolo #${d.protocolo}`,
                    status: d.status || 'Pendente',
                    date: new Date(d.created_at),
                })),
                ...newsData.slice(0, 5).map((n: any) => ({
                    type: 'Notícia',
                    description: n.title,
                    status: 'Publicada',
                    date: new Date(n.created_at),
                })),
                ...casesData.filter((c: any) => c.is_published).slice(0, 5).map((c: any) => ({
                    type: 'Case',
                    description: c.title,
                    status: 'Publicado',
                    date: new Date(c.created_at),
                })),
            ];

            const sortedActions = actions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 10)
                .map(action => ({
                    ...action,
                    dateFormatted: action.date.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));

            setRecentActions(sortedActions);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (type: string, status: string) => {
        if (type === 'Denúncia') {
            switch (status) {
                case 'Pendente':
                    return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
                case 'Em Análise':
                    return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                case 'Resolvido':
                    return 'bg-green-500/10 text-green-500 border border-green-500/20';
                default:
                    return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
            }
        } else if (type === 'Case') {
            return status === 'Publicado'
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
        } else {
            return status === 'Publicada'
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-zinc-400">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400">Bem-vindo ao painel de gestão do site.</p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-lg font-semibold">Notícias</h2>
                    <div className="mt-4 space-y-1">
                        <p className="text-3xl font-bold">{stats.totalNews}</p>
                        <p className="text-sm text-zinc-400">Total de notícias</p>
                    </div>
                    <div className="mt-4 text-sm text-zinc-500">
                        <span className="text-green-400">{stats.publishedNews}</span> publicadas
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-lg font-semibold">Cases</h2>
                    <div className="mt-4 space-y-1">
                        <p className="text-3xl font-bold">{stats.totalCases}</p>
                        <p className="text-sm text-zinc-400">Total de cases</p>
                    </div>
                    <div className="mt-4 text-sm text-zinc-500">
                        <span className="text-green-400">{stats.publishedCases}</span> publicados
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-lg font-semibold">Denúncias</h2>
                    <div className="mt-4 space-y-1">
                        <p className="text-3xl font-bold">{stats.totalDenuncias}</p>
                        <p className="text-sm text-zinc-400">Total recebido</p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-zinc-400">{stats.resolvedDenuncias} resolvidas</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-zinc-400">{stats.analyzingDenuncias} em análise</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <span className="text-zinc-400">{stats.pendingDenuncias} pendentes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Actions Table */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Ações Recentes</h2>
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-950">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                    Descrição
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                                    Data
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {recentActions.map((action, index) => (
                                <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {action.type}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-300">
                                        {action.description.length > 60
                                            ? action.description.substring(0, 60) + '...'
                                            : action.description}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(action.type, action.status)}`}>
                                            {action.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                                        {action.dateFormatted}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentActions.length === 0 && (
                        <div className="p-6 text-center text-zinc-500">
                            Nenhuma ação recente encontrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
