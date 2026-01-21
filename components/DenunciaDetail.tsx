"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Denuncia } from "@/lib/data";

interface DenunciaDetailProps {
    initialData: Denuncia;
    onUpdateStatus: (status: Denuncia["status"]) => void;
    onUpdateNote?: (note: string) => void | Promise<void>;
}

export function DenunciaDetail({ initialData, onUpdateStatus, onUpdateNote }: DenunciaDetailProps) {
    const router = useRouter();
    const [status, setStatus] = useState<Denuncia["status"]>(initialData.status);
    const [note, setNote] = useState(initialData.status_note || "");
    const [savingNote, setSavingNote] = useState(false);
    const [noteSaveMessage, setNoteSaveMessage] = useState<string | null>(null);

    const handleStatusChange = (newStatus: Denuncia["status"]) => {
        setStatus(newStatus);
        onUpdateStatus(newStatus);
    };

    return (
        <div className="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-zinc-400">Descrição</h3>
                        <p className="mt-2 text-white p-4 rounded-lg bg-zinc-950 border border-zinc-800">{initialData.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-zinc-400">Detalhes da Ocorrência</h3>
                        <dl className="mt-2 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950">
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Tipo</dt>
                                <dd className="text-sm text-white">{initialData.tipo_denuncia || '-'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Data do Fato</dt>
                                <dd className="text-sm text-white">{initialData.data_ocorrencia || initialData.date}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Continua Ocorrendo?</dt>
                                <dd className="text-sm text-white">{initialData.continua_ocorrendo ? 'Sim' : 'Não'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Valor Financeiro</dt>
                                <dd className="text-sm text-white">{initialData.valor_financeiro || '-'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-zinc-400">Localização e Envolvidos</h3>
                        <dl className="mt-2 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950">
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Unidade/Localidade</dt>
                                <dd className="text-sm text-white">{initialData.unidade_localidade || '-'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Setor/Gerência</dt>
                                <dd className="text-sm text-white">{initialData.setor_gerencia || '-'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Agentes Envolvidos</dt>
                                <dd className="text-sm text-white">{initialData.agentes_envolvidos || '-'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Contrato Identificado</dt>
                                <dd className="text-sm text-white">{initialData.contrato_identificado || '-'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-zinc-400">Informações do Denunciante</h3>
                        <dl className="mt-2 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950">
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Identificado?</dt>
                                <dd className="text-sm text-white">{initialData.usuario_identificado ? 'Sim' : 'Não'}</dd>
                            </div>
                            {initialData.usuario_identificado && (
                                <>
                                    <div className="flex justify-between p-3">
                                        <dt className="text-sm text-zinc-400">Nome</dt>
                                        <dd className="text-sm text-white">{initialData.nome || '-'}</dd>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <dt className="text-sm text-zinc-400">Email</dt>
                                        <dd className="text-sm text-white">{initialData.email || '-'}</dd>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Liderança Ciente?</dt>
                                <dd className="text-sm text-white">{initialData.lideranca_ciente ? 'Sim' : 'Não'}</dd>
                            </div>
                            <div className="flex justify-between p-3">
                                <dt className="text-sm text-zinc-400">Liderança Envolvida?</dt>
                                <dd className="text-sm text-white">{initialData.lideranca_envolvida ? 'Sim' : 'Não'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-zinc-400">Evidências e Testemunhas</h3>
                        <div className="mt-2 space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400">Testemunhas</h4>
                                <p className="mt-1 text-sm text-white">{initialData.existem_testemunhas ? (initialData.testemunhas || 'Sim, mas não listadas') : 'Não há testemunhas'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400">Evidências</h4>
                                <p className="mt-1 text-sm text-white">{initialData.existem_evidencias ? (initialData.descricao_evidencias || 'Sim, mas não descritas') : 'Não há evidências'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-zinc-400">Tentativa de Ocultação?</h4>
                                <p className="mt-1 text-sm text-white">{initialData.tentativa_ocultacao ? 'Sim' : 'Não'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-zinc-400">Status</h3>
                <div className="mt-2 flex space-x-4">
                    {(["Pendente", "Em Análise", "Resolvido"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === s
                                ? "bg-primary text-black"
                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {onUpdateNote && (
                <div>
                    <h3 className="text-lg font-medium text-zinc-400">Nota de Status</h3>
                    <textarea
                        className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-primary focus:outline-none"
                        rows={4}
                        placeholder="Adicione uma nota sobre o status..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            try {
                                setSavingNote(true);
                                setNoteSaveMessage(null);
                                await onUpdateNote(note);
                                setNoteSaveMessage("Nota salva.");
                            } catch {
                                setNoteSaveMessage("Falha ao salvar. Veja o alerta/console para detalhes.");
                            } finally {
                                setSavingNote(false);
                            }
                        }}
                        disabled={savingNote}
                        className="mt-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-60"
                    >
                        {savingNote ? "Salvando..." : "Salvar Nota"}
                    </button>
                    {noteSaveMessage && (
                        <p className="mt-2 text-sm text-zinc-400">{noteSaveMessage}</p>
                    )}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}
