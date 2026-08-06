export const PRAZO_EDICAO_HORAS = 24;

export function podeEditar(criadoEm: string): boolean {
    const horasDesdeCriacao = (Date.now() - new Date(criadoEm).getTime()) / (1000 * 60 * 60)
    return horasDesdeCriacao <= PRAZO_EDICAO_HORAS
}