"use client";

import { NewsForm } from "@/components/NewsForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";


export default function NewNewsPage() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File, folder: string = "news"): Promise<string | null> => {
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

            // Upload cover image
            let coverImageUrl = "";
            if (data.coverImage instanceof File) {
                const url = await uploadImage(data.coverImage, "news/covers");
                if (url) coverImageUrl = url;
            } else if (typeof data.coverImage === 'string') {
                coverImageUrl = data.coverImage;
            }

            // Upload block image
            let blockImageUrl = "";
            if (data.blockImage instanceof File) {
                const url = await uploadImage(data.blockImage, "news/blocks");
                if (url) blockImageUrl = url;
            } else if (typeof data.blockImage === 'string') {
                blockImageUrl = data.blockImage;
            }

            // Upload gallery images
            const galleryImageUrls: string[] = [];
            if (data.galleryImages && data.galleryImages.length > 0) {
                for (const item of data.galleryImages) {
                    if (item instanceof File) {
                        const url = await uploadImage(item, "news/gallery");
                        if (url) galleryImageUrls.push(url);
                    } else if (typeof item === 'string') {
                        galleryImageUrls.push(item);
                    }
                }
            }

            const { error } = await supabase.from("news").insert({
                title: data.title,
                subtitle: data.subtitle,
                author: data.author,
                cover_image: coverImageUrl,
                introduction: data.introduction,
                tag: data.tag,

                // Blocks
                block1_title: data.block1_title,
                block1_body: data.block1_body,
                block2_title: data.block2_title,
                block2_body: data.block2_body,
                block_image: blockImageUrl,
                block3_title: data.block3_title,
                block3_body: data.block3_body,

                // Gallery
                gallery_images: galleryImageUrls,
                gallery_captions: data.gallery_captions,

                // Meta
                slug: data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Date.now(),
                published_at: data.published ? new Date().toISOString() : null,
            });

            if (error) {
                console.error("Error creating news:", error);
                alert("Erro ao criar notícia");
            } else {
                console.log("Created news:", data);
                router.push("/news");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Erro inesperado ao criar notícia");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">Nova Notícia</h1>
            {isUploading && (
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Fazendo upload das imagens... Por favor, aguarde.
                </div>
            )}
            <NewsForm onSubmit={handleCreate} />
        </div>
    );
}
