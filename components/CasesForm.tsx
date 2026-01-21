"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Plus, Check } from "lucide-react";

// Available services enum (must match database enum)
interface CasesFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
}

export function CasesForm({ initialData, onSubmit }: CasesFormProps) {
    const router = useRouter();

    // Basic fields
    const [title, setTitle] = useState(initialData?.title || "");
    const [clientName, setClientName] = useState(initialData?.client_name || "");
    const [projectDate, setProjectDate] = useState(
        initialData?.project_date || new Date().toISOString().split("T")[0]
    );
    const [location, setLocation] = useState(initialData?.location || "");

    // New fields
    const [intro, setIntro] = useState(initialData?.intro || "");
    const [serviceDescription, setServiceDescription] = useState(initialData?.service_description || "");
    const [differential, setDifferential] = useState(initialData?.differential || "");
    const [serviceDurationMonths, setServiceDurationMonths] = useState(initialData?.service_duration_months || "");
    const [totalPeople, setTotalPeople] = useState(initialData?.total_people || "");
    const [startDate, setStartDate] = useState(initialData?.start_date || "");
    const [endDate, setEndDate] = useState(initialData?.end_date || "");
    const [populationServed, setPopulationServed] = useState(initialData?.population_served || "");
    const [contractManagement, setContractManagement] = useState(initialData?.contract_management || "");
    const [technicalCoordination, setTechnicalCoordination] = useState(initialData?.technical_coordination || "");

    // Products
    const [products, setProducts] = useState<string[]>(initialData?.products || []);

    // Images
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState(initialData?.cover_image || "");

    const [serviceImage, setServiceImage] = useState<File | null>(null);
    const [serviceImagePreview, setServiceImagePreview] = useState(initialData?.service_image || "");

    // Published status
    const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (f: File | null) => void,
        setPreview: (s: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Products Management
    const addProduct = () => {
        setProducts([...products, ""]);
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const updateProduct = (index: number, value: string) => {
        const newProducts = [...products];
        newProducts[index] = value;
        setProducts(newProducts);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            title,
            client_name: clientName,
            project_date: projectDate,
            location,
            intro,
            service_description: serviceDescription,
            products: products.filter(p => p.trim() !== ""), // filter empty entries
            differential,
            service_duration_months: serviceDurationMonths ? parseInt(serviceDurationMonths) : null,
            total_people: totalPeople ? parseInt(totalPeople) : null,
            start_date: startDate || null,
            end_date: endDate || null,
            population_served: populationServed,
            contract_management: contractManagement,
            technical_coordination: technicalCoordination,
            coverImage,
            serviceImage,
            is_published: isPublished,
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Informações Básicas</h2>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-400">
                        Título *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-zinc-400">
                            Cliente *
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="projectDate" className="block text-sm font-medium text-zinc-400">
                            Data do Projeto *
                        </label>
                        <input
                            type="date"
                            id="projectDate"
                            value={projectDate}
                            onChange={(e) => setProjectDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-zinc-400">
                        Localização
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="intro" className="block text-sm font-medium text-zinc-400">
                        Introdução
                    </label>
                    <textarea
                        id="intro"
                        rows={3}
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Imagem de Capa</h2>
                    <div>
                        <label
                            htmlFor="coverImage"
                            className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-6 py-8 hover:border-primary transition-colors"
                        >
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                                <p className="mt-2 text-sm text-zinc-400">
                                    Selecionar Capa
                                </p>
                            </div>
                            <input
                                id="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, setCoverImage, setCoverImagePreview)}
                                className="hidden"
                            />
                        </label>

                        {coverImagePreview && (
                            <div className="mt-4 relative">
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
                </div>

                {/* Service Image */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Imagem do Serviço</h2>
                    <div>
                        <label
                            htmlFor="serviceImage"
                            className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-6 py-8 hover:border-primary transition-colors"
                        >
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                                <p className="mt-2 text-sm text-zinc-400">
                                    Selecionar Imagem Serviço
                                </p>
                            </div>
                            <input
                                id="serviceImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, setServiceImage, setServiceImagePreview)}
                                className="hidden"
                            />
                        </label>

                        {serviceImagePreview && (
                            <div className="mt-4 relative">
                                <img
                                    src={serviceImagePreview}
                                    alt="Service preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setServiceImage(null);
                                        setServiceImagePreview("");
                                    }}
                                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Detalhes do Serviço</h2>

                <div>
                    <label htmlFor="serviceDescription" className="block text-sm font-medium text-zinc-400">
                        Descrição do Serviço
                    </label>
                    <textarea
                        id="serviceDescription"
                        rows={4}
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="differential" className="block text-sm font-medium text-zinc-400">
                        Diferencial
                    </label>
                    <textarea
                        id="differential"
                        rows={3}
                        value={differential}
                        onChange={(e) => setDifferential(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>
            </div>

            {/* Additional Project Details */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Detalhes do Projeto</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="serviceDurationMonths" className="block text-sm font-medium text-zinc-400">
                            Prazo do Serviço (meses)
                        </label>
                        <input
                            type="number"
                            id="serviceDurationMonths"
                            value={serviceDurationMonths}
                            onChange={(e) => setServiceDurationMonths(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="totalPeople" className="block text-sm font-medium text-zinc-400">
                            Pessoas Impactadas/Envolvidas
                        </label>
                        <input
                            type="number"
                            id="totalPeople"
                            value={totalPeople}
                            onChange={(e) => setTotalPeople(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-zinc-400">
                            Data de Início
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-zinc-400">
                            Data de Término
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="populationServed" className="block text-sm font-medium text-zinc-400">
                        População Atendida
                    </label>
                    <input
                        type="text"
                        id="populationServed"
                        value={populationServed}
                        onChange={(e) => setPopulationServed(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="contractManagement" className="block text-sm font-medium text-zinc-400">
                            Gestão do Contrato
                        </label>
                        <input
                            type="text"
                            id="contractManagement"
                            value={contractManagement}
                            onChange={(e) => setContractManagement(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="technicalCoordination" className="block text-sm font-medium text-zinc-400">
                            Coordenação Técnica
                        </label>
                        <input
                            type="text"
                            id="technicalCoordination"
                            value={technicalCoordination}
                            onChange={(e) => setTechnicalCoordination(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Produtos</h2>
                    <button
                        type="button"
                        onClick={addProduct}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar Produto
                    </button>
                </div>

                <div className="space-y-2">
                    {products.map((product, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={product}
                                onChange={(e) => updateProduct(index, e.target.value)}
                                placeholder="Nome do produto"
                                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeProduct(index)}
                                className="p-2 text-zinc-400 hover:text-red-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <p className="text-sm text-zinc-500 italic">Nenhum produto adicionado.</p>
                    )}
                </div>
            </div>

            {/* Publishing Status */}
            <div className="flex items-center">
                <input
                    id="isPublished"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-zinc-400">
                    Publicar imediatamente
                </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 border-t border-zinc-800 pt-6">
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
                    Salvar Case
                </button>
            </div>
        </form>
    );
}
