"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadButtonProps {
  html: string
  marca: string
  dispositivo: string
  ciudad: string
}

export function DownloadButton({ html, marca, dispositivo, ciudad }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (!html) return

    setIsDownloading(true)

    try {
      // Crear un blob con el HTML
      const blob = new Blob([html], { type: "text/html" })

      // Crear una URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un elemento <a> para descargar
      const a = document.createElement("a")
      a.href = url

      // Formatear el nombre del archivo
      const marcaSlug = marca
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
      const dispositivoSlug = dispositivo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
      const ciudadSlug = ciudad
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")

      a.download = `reparacion-${dispositivoSlug}-${marcaSlug}-${ciudadSlug}.html`

      // Añadir el elemento al DOM, hacer clic y luego eliminarlo
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Liberar la URL del objeto
      URL.revoObjectURL(url)
    } catch (error) {
      console.error("Error al descargar el archivo:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={!html || isDownloading} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      {isDownloading ? "Descargando..." : "Descargar HTML"}
    </Button>
  )
}
