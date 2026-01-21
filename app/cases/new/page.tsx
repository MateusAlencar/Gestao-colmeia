"use client";

import { CasesForm } from "@/components/CasesForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function NewCasePage() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File, folder: string = "cases"): Promise<string | null> => {
        try {
            console.log(`Uploading image: ${file.name} to folder: ${folder}`);
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            console.log(`Full path: ${filePath}`);

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

    const handleCreate = async (data: any) => {
        try {
            setIsUploading(true);
            console.log("Starting case creation with data:", data);

            // 1. Upload cover image
            let coverImageUrl = "";
            if (data.coverImage) {
                console.log("Uploading cover image...");
                const url = await uploadImage(data.coverImage, "cases/covers");
                if (url) {
                    coverImageUrl = url;
                }
            }

            // 2. Upload service image
            let serviceImageUrl = "";
            if (data.serviceImage) {
                console.log("Uploading service image...");
                const url = await uploadImage(data.serviceImage, "cases/services");
                if (url) {
                    serviceImageUrl = url;
                }
            }

            // Generate slug from title
            const slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") + "-" + Date.now();

            // Prepare the case data
            const caseData = {
                slug,
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
            };

            const { error, data: insertedData } = await supabase
                .from("cases")
                .insert(caseData)
                .select();

            if (error) {
                console.error("Error creating case:", error);
                alert(`Erro ao criar case: ${error.message}`);
                return;
            }

            console.log("Case created successfully:", insertedData);
            alert("Case criado com sucesso!");
            router.push("/cases");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Erro inesperado ao criar case");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">Novo Case</h1>
            {isUploading && (
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Fazendo upload das imagens... Por favor, aguarde.
                </div>
            )}
            <CasesForm onSubmit={handleCreate} />
        </div>
    );
}
