function matriculasProtegidas(): string[] {
  return (process.env.MATRICULAS_PROTEGIDAS ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
}

export function ehMatriculaProtegida(matricula: string): boolean {
  return matriculasProtegidas().includes(matricula);
}