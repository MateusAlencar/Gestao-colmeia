"use client";

import { use, useState, useEffect } from "react";
import { NewsForm } from "@/components/NewsForm";
import { News } from "@/lib/data";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [newsItem, setNewsItem] = useState<any | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const fetchNewsItem = async () => {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("id", resolvedParams.id)
                .single();

            if (error) {
                console.error("Error fetching news item:", error);
                router.push("/news");
            } else if (data) {
                setNewsItem({
                    id: data.id,
                    title: data.title,
                    content: typeof data.content_blocks === 'string' ? data.content_blocks : JSON.stringify(data.content_blocks),
                    date: new Date(data.created_at).toLocaleDateString('pt-BR'),
                    published: true // Default
                });
            }
        };

        fetchNewsItem();
    }, [resolvedParams.id, router]);

    const handleUpdate = async (data: any) => {
        const { error } = await supabase
            .from("news")
            .update({
                title: data.title,
                content_blocks: data.content,
                // Add other fields if needed
            })
            .eq("id", resolvedParams.id);

        if (error) {
            console.error("Error updating news:", error);
            alert("Erro ao atualizar notícia");
        } else {
            console.log("Updated news:", data);
            router.push("/news");
        }
    };

    if (!newsItem) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">Editar Notícia</h1>
            <NewsForm initialData={newsItem} onSubmit={handleUpdate} />
        </div>
    );
}
