export type NewsTag = "Geral" | "Importante" | "Atualização" | "Evento" | "Manutenção";

export type News = {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    cover_image?: string;
    author?: string;
    content_blocks?: any;
    created_at?: string;
    updated_at?: string;
    gallery_images?: string[];
    gallery_captions?: string[];
    tag?: NewsTag;
    published_at?: string;
    introduction?: string;
    block1_title?: string;
    block1_body?: string;
    block2_title?: string;
    block2_body?: string;
    block_image?: string;
    block3_title?: string;
    block3_body?: string;
    published: boolean; // Keeping this for local state management if needed, though schema uses published_at
};

export type Case = {
    id: string;
    slug: string;
    title: string;
    cover_image?: string;
    client_name: string;
    project_date: string;
    location?: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
    intro?: string;
    service_image?: string;
    service_description?: string;
    products?: string[];
    differential?: string;
    service_duration_months?: number;
    total_people?: number;
    start_date?: string;
    end_date?: string;
    population_served?: string;
    contract_management?: string;
    technical_coordination?: string;
};

export type Denuncia = {
    id: string;
    description: string;
    status: "Pendente" | "Em Análise" | "Resolvido";
    date: string;
    contact_info?: string;
    protocolo?: string;
    status_note?: string;
    // New fields
    usuario_identificado?: boolean;
    nome?: string;
    email?: string;
    tipo_denuncia?: string;
    agentes_envolvidos?: string;
    data_ocorrencia?: string;
    continua_ocorrendo?: boolean;
    unidade_localidade?: string;
    setor_gerencia?: string;
    contrato_identificado?: string;
    lideranca_ciente?: boolean;
    lideranca_envolvida?: boolean;
    tentativa_ocultacao?: boolean;
    existem_testemunhas?: boolean;
    testemunhas?: string;
    existem_evidencias?: boolean;
    descricao_evidencias?: string;
    valor_financeiro?: string;
};

// Static data removed in favor of Supabase integration
