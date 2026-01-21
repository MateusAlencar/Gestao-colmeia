"use client";

import { use, useState, useEffect } from "react";
import { CasesForm } from "@/components/CasesForm";
import { Case } from "@/lib/data";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [caseItem, setCaseItem] = useState<Case | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCaseItem = async () => {
            const { data, error } = await supabase
                .from("cases")
                .select("*")
                .eq("id", resolvedParams.id)
                .single();

            if (error) {
                console.error("Error fetching case:", error);
                alert("Erro ao carregar case");
                router.push("/cases");
            } else if (data) {
                setCaseItem(data as Case);
            }
            setIsLoading(false);
        };

        fetchCaseItem();
    }, [resolvedParams.id, router]);

    const uploadImage = async (file: File, folder: string = "cases"): Promise<string | null> => {
        try {
            console.log(`Uploading image: ${file.name} to folder: ${folder}`);
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                alert(`Erro ao fazer upload da imagem ${file.name}: ${uploadError.message}`);
                return null;
            }

            console.log("Upload successful:", uploadData);

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            console.log("Public URL:", data.publicUrl);
            return data.publicUrl;
        } catch (error) {
            console.error("Error in uploadImage:", error);
            alert(`Erro inesperado ao fazer upload: ${error}`);
            return null;
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            setIsUploading(true);
            console.log("Updating case with data:", data);

            // 1. Upload new cover image if provided
            let coverImageUrl = caseItem?.cover_image || "";
            if (data.coverImage) {
                console.log("Uploading new cover image...");
                const url = await uploadImage(data.coverImage, "cases/covers");
                if (url) {
                    coverImageUrl = url;
                }
            }

            // 2. Upload new service image if provided
            let serviceImageUrl = caseItem?.service_image || "";
            if (data.serviceImage) {
                console.log("Uploading new service image...");
                const url = await uploadImage(data.serviceImage, "cases/services");
                if (url) {
                    serviceImageUrl = url;
                }
            }

            // Prepare the update data
            const updateData = {
                title: data.title,
                client_name: data.client_name,
                project_date: data.project_date,
                location: data.location || null,

                intro: data.intro || null,
                service_description: data.service_description || null,
                products: data.products?.length > 0 ? data.products : null,
                differential: data.differential || null,
                service_duration_months: data.service_duration_months || null,
                total_people: data.total_people || null,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                population_served: data.population_served || null,
                contract_management: data.contract_management || null,
                technical_coordination: data.technical_coordination || null,

                cover_image: coverImageUrl || null,
                service_image: serviceImageUrl || null,

                is_published: data.is_published,
                updated_at: new Date().toISOString(),
            };

            const { error, data: updatedData } = await supabase
                .from("cases")
                .update(updateData)
                .eq("id", resolvedParams.id)
                .select();

            if (error) {
                console.error("Error updating case:", error);
                alert(`Erro ao atualizar case: ${error.message}`);
                return;
            }

            console.log("Case updated successfully:", updatedData);
            alert("Case atualizado com sucesso!");
            router.push("/cases");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Erro inesperado ao atualizar case");
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-center py-12">
                    <div className="text-zinc-400">Carregando...</div>
                </div>
            </div>
        );
    }

    if (!caseItem) {
        return (
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-center py-12">
                    <div className="text-red-400">Case não encontrado</div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">Editar Case</h1>
            {isUploading && (
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Fazendo upload das imagens... Por favor, aguarde.
                </div>
            )}
            <CasesForm initialData={caseItem} onSubmit={handleUpdate} />
        </div>
    );
}
