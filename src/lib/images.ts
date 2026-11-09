import { getImage } from "astro:assets";

/**
 * Una foto en varios tamaños (webp) para `srcset`: el navegador descarga solo el que necesita, en lugar
 * de la foto original de 2400 px. `src` es el tamaño mayor, para los navegadores sin `srcset`.
 */
export async function responsiveImage(source: ImageMetadata, widths: number[]) {
  const largest = Math.max(...widths);
  const image = await getImage({
    src: source,
    width: largest,
    widths,
    format: "webp",
    quality: 78,
  });
  return {
    src: image.src,
    srcSet: image.srcSet.attribute,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
  };
}
