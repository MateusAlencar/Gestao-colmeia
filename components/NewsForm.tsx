
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { News } from "@/lib/data";
import { Upload, X } from "lucide-react";

interface NewsFormProps {
    initialData?: News;
    onSubmit: (data: any) => void;
}

export function NewsForm({ initialData, onSubmit }: NewsFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
    const [author, setAuthor] = useState(initialData?.author || "");
    const [introduction, setIntroduction] = useState(initialData?.introduction || "");
    const [tag, setTag] = useState<any>(initialData?.tag || "Geral");
    const [published, setPublished] = useState(initialData?.published || false);

    // Images
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState(initialData?.cover_image || "");

    // Blocks
    const [block1Title, setBlock1Title] = useState(initialData?.block1_title || "");
    const [block1Body, setBlock1Body] = useState(initialData?.block1_body || "");
    const [block2Title, setBlock2Title] = useState(initialData?.block2_title || "");
    const [block2Body, setBlock2Body] = useState(initialData?.block2_body || "");

    const [blockImage, setBlockImage] = useState<File | null>(null);
    const [blockImagePreview, setBlockImagePreview] = useState(initialData?.block_image || "");

    const [block3Title, setBlock3Title] = useState(initialData?.block3_title || "");
    const [block3Body, setBlock3Body] = useState(initialData?.block3_body || "");

    // Gallery
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>(initialData?.gallery_images || []);
    const [galleryCaptions, setGalleryCaptions] = useState<string[]>(initialData?.gallery_captions || []);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBlockImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlockImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlockImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setGalleryImages([...galleryImages, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGalleryImagePreviews(prev => [...prev, reader.result as string]);
                    setGalleryCaptions(prev => [...prev, ""]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveGalleryItem = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
        setGalleryCaptions(prev => prev.filter((_, i) => i !== index));
    };

    const handleGalleryCaptionChange = (index: number, value: string) => {
        const newCaptions = [...galleryCaptions];
        newCaptions[index] = value;
        setGalleryCaptions(newCaptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            subtitle,
            author,
            coverImage, // Pass File object
            introduction,
            tag,
            published,
            block1_title: block1Title,
            block1_body: block1Body,
            block2_title: block2Title,
            block2_body: block2Body,
            blockImage, // Pass File object
            block3_title: block3Title,
            block3_body: block3Body,
            galleryImages, // Pass File[]
            gallery_captions: galleryCaptions,
            slug: initialData?.slug || "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Informações Básicas</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-400">Título</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-zinc-400">Subtítulo</label>
                        <input
                            type="text"
                            id="subtitle"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-zinc-400">Autor</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="tag" className="block text-sm font-medium text-zinc-400">Tag</label>
                        <select
                            id="tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="Geral">Geral</option>
                            <option value="Importante">Importante</option>
                            <option value="Atualização">Atualização</option>
                            <option value="Evento">Evento</option>
                            <option value="Manutenção">Manutenção</option>
                        </select>
                    </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Imagem de Capa</label>
                    <label
                        htmlFor="coverImage"
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-6 py-8 hover:border-primary transition-colors"
                    >
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-400">
                                Clique para selecionar a imagem de capa
                            </p>
                        </div>
                        <input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="hidden"
                        />
                    </label>

                    {coverImagePreview && (
                        <div className="mt-4 relative w-full max-w-md">
                            <img
                                src={coverImagePreview}
                                alt="Cover preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setCoverImage(null);
                                    setCoverImagePreview("");
                                }}
                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="introduction" className="block text-sm font-medium text-zinc-400">Introdução</label>
                    <textarea
                        id="introduction"
                        rows={3}
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 border-t border-zinc-800 pt-4">
                <h3 className="text-lg font-medium text-white">Conteúdo</h3>

                {/* Block 1 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Bloco 1</label>
                    <input
                        type="text"
                        placeholder="Título do Bloco 1"
                        value={block1Title}
                        onChange={(e) => setBlock1Title(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                    <textarea
                        rows={4}
                        placeholder="Conteúdo do Bloco 1"
                        value={block1Body}
                        onChange={(e) => setBlock1Body(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                {/* Block 2 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Bloco 2</label>
                    <input
                        type="text"
                        placeholder="Título do Bloco 2"
                        value={block2Title}
                        onChange={(e) => setBlock2Title(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                    <textarea
                        rows={4}
                        placeholder="Conteúdo do Bloco 2"
                        value={block2Body}
                        onChange={(e) => setBlock2Body(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                {/* Block Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Imagem de Destaque</label>
                    <label
                        htmlFor="blockImage"
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-6 py-8 hover:border-primary transition-colors"
                    >
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-400">
                                Clique para selecionar a imagem de destaque
                            </p>
                        </div>
                        <input
                            id="blockImage"
                            type="file"
                            accept="image/*"
                            onChange={handleBlockImageChange}
                            className="hidden"
                        />
                    </label>

                    {blockImagePreview && (
                        <div className="mt-4 relative w-full max-w-md">
                            <img
                                src={blockImagePreview}
                                alt="Block preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setBlockImage(null);
                                    setBlockImagePreview("");
                                }}
                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Block 3 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Bloco 3</label>
                    <input
                        type="text"
                        placeholder="Título do Bloco 3"
                        value={block3Title}
                        onChange={(e) => setBlock3Title(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                    <textarea
                        rows={4}
                        placeholder="Conteúdo do Bloco 3"
                        value={block3Body}
                        onChange={(e) => setBlock3Body(e.target.value)}
                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 border-t border-zinc-800 pt-4">
                <h3 className="text-lg font-medium text-white">Galeria</h3>

                <div>
                    <label
                        htmlFor="galleryImages"
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-6 py-8 hover:border-primary transition-colors"
                    >
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-400">
                                Clique para adicionar imagens à galeria
                            </p>
                        </div>
                        <input
                            id="galleryImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryImagesChange}
                            className="hidden"
                        />
                    </label>

                    {galleryImagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {galleryImagePreviews.map((preview, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt={`Gallery image ${index + 1} `}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryItem(index)}
                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Legenda"
                                        value={galleryCaptions[index] || ""}
                                        onChange={(e) => handleGalleryCaptionChange(index, e.target.value)}
                                        className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center border-t border-zinc-800 pt-4">
                <input
                    id="published"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-zinc-400">
                    Publicado
                </label>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
                >
                    Salvar
                </button>
            </div>
        </form>
    );
}
