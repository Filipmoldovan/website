import { generarContenidoPagina } from "@/lib/generador-contenido"
import type { Marca, Dispositivo } from "@/data/marcas-dispositivos"
import type { Ciudad } from "@/data/ciudades-zonas"

// Definir los tipos de mensajes que el worker puede recibir y enviar
interface GenerateHtmlMessage {
  type: "GENERATE_HTML"
  marca: Marca
  dispositivo: Dispositivo
  ciudad: Ciudad
  todasLasMarcas: Marca[]
  index: number
  total: number
}

interface GenerateHtmlResponse {
  type: "HTML_GENERATED"
  html: string
  filename: string
  marcaSlug: string
  dispositivoSlug: string
  ciudadSlug: string
  marca: string
  dispositivo: string
  ciudad: string
  index: number
  total: number
}

interface ProgressMessage {
  type: "PROGRESS"
  index: number
  total: number
}

type WorkerMessage = GenerateHtmlMessage
type WorkerResponse = GenerateHtmlResponse | ProgressMessage

// Configurar el worker para recibir mensajes
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data

  if (message.type === "GENERATE_HTML") {
    const { marca, dispositivo, ciudad, todasLasMarcas, index, total } = message

    // Generar el HTML
    const html = generarContenidoPagina(marca, dispositivo, ciudad, todasLasMarcas)

    // Crear el nombre del archivo
    const filename = `reparacion-${dispositivo.slug}-${marca.slug}-${ciudad.slug}.html`

    // Enviar el resultado de vuelta al hilo principal
    const response: GenerateHtmlResponse = {
      type: "HTML_GENERATED",
      html,
      filename,
      marcaSlug: marca.slug,
      dispositivoSlug: dispositivo.slug,
      ciudadSlug: ciudad.slug,
      marca: marca.nombre,
      dispositivo: dispositivo.nombre,
      ciudad: ciudad.nombre,
      index,
      total,
    }

    self.postMessage(response)
  }
}
