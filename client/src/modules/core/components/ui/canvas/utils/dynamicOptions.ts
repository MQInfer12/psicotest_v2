export function getOptionText(
  descripcion: string,
  numeroOpcion: number
): string | null {
  const regex = new RegExp(`<op${numeroOpcion}>(.*?)</op${numeroOpcion}>`, "i");
  const resultado = regex.exec(descripcion);
  if (resultado && resultado[1]) {
    return resultado[1].trim();
  }
  return null;
}

export function cleanOptionTags(descripcion: string): string {
  return descripcion.replace(/<op(\d+)>.*?<\/op\1>/g, "").trim();
}
