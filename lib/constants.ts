// Available services for case forms (must match database enum)
export const AVAILABLE_SERVICES = [
    "Elaboração de Projetos",
    "Gerenciamento de Obras",
    "Execução de Obras",
    "Intervenções Socioambientais",
    "Resiliência Climática",
    "Estudos Integrados",
] as const;

export type ServiceType = typeof AVAILABLE_SERVICES[number];
