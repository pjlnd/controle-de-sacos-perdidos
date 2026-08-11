import { NextResponse } from "next/server";
import { obterMatriculaLogada } from "./sessao";
import { buscarUsuarioPorMatricula } from "./usuarios";
import type { UsuarioFlat } from "./types";

export async function usuarioAutenticado(): Promise<UsuarioFlat | null> {
    const matricula = obterMatriculaLogada();
    if (!matricula) return null

    const usuario = await buscarUsuarioPorMatricula(matricula)
    if (!usuario || usuario.status === 'inativo') return null

    return usuario
}

export async function respostaNaoAutorizado() {
    return NextResponse.json(
        { erro: 'É necessário estar logado para realizar essa ação.' },
        { status: 401}
    )
}

export function respostaSemPermissao() {
    return NextResponse.json(

        { erro: 'Seu usuário não tem permissão para realizar essa ação.' },
        { status: 401 }
    )
}