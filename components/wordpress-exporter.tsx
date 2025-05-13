"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, Check, AlertTriangle, Upload } from "lucide-react"
import { WordPressConfigForm } from "@/components/wordpress-config-form"
import { WordPressExportOptions } from "@/components/wordpress-export-options"
import { wordPressService, type WordPressConfig, type ExportOptions } from "@/lib/wordpress-service"

interface WordPressExporterProps {
  htmlContents: { html: string; slug?: string }[]
  onExportComplete?: () => void
}

export function WordPressExporter({ htmlContents, onExportComplete }: WordPressExporterProps) {
  const [activeTab, setActiveTab] = useState("config")
  const [config, setConfig] = useState<WordPressConfig | null>(null)
  const [options, setOptions] = useState<ExportOptions | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [exportedUrls, setExportedUrls] = useState<string[]>([])

  // Cargar configuración guardada al montar el componente
  useEffect(() => {
    const savedConfig = localStorage.getItem("wordpress_config")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
        wordPressService.setConfig(parsedConfig)
      } catch (err) {
        console.error("Error al cargar la configuración guardada:", err)
      }
    }

    const savedOptions = localStorage.getItem("wordpress_export_options")
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions))
      } catch (err) {
        console.error("Error al cargar las opciones guardadas:", err)
      }
    }
  }, [])

  // Manejar guardado de configuración
  const handleConfigSaved = (newConfig: WordPressConfig) => {
    setConfig(newConfig)
    localStorage.setItem("wordpress_config", JSON.stringify(newConfig))
    setActiveTab("options")
  }

  // Manejar selección de opciones
  const handleOptionsSelected = (newOptions: ExportOptions) => {
    setOptions(newOptions)
    localStorage.setItem("wordpress_export_options", JSON.stringify(newOptions))
  }

  // Manejar exportación a WordPress
  const handleExport = async () => {
    if (!config || !options) {
      setError("Debe configurar la conexión y las opciones de exportación primero")
      return
    }

    if (htmlContents.length === 0) {
      setError("No hay contenido para exportar")
      return
    }

    setIsExporting(true)
    setError(null)
    setSuccess(null)
    setProgress({ current: 0, total: htmlContents.length, percent: 0 })
    setExportedUrls([])

    try {
      // Asegurarse de que la configuración esté establecida
      wordPressService.setConfig(config)

      // Exportar contenido
      const results = await wordPressService.publishMultipleContents(htmlContents, options, (current, total) => {
        const percent = Math.round((current / total) * 100)
        setProgress({ current, total, percent })
      })

      // Recopilar URLs de los contenidos exportados
      const urls = results.map((result) => result.link).filter(Boolean)
      setExportedUrls(urls)

      setSuccess(`Se han exportado ${results.length} de ${htmlContents.length} contenidos correctamente`)

      // Llamar al callback de finalización si se proporciona
      if (onExportComplete) {
        onExportComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al exportar contenido a WordPress")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exportar a WordPress</CardTitle>
        <CardDescription>
          Exporte el contenido generado directamente a su sitio WordPress mediante la API REST.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="options" disabled={!config}>
              Opciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <WordPressConfigForm onConfigSaved={handleConfigSaved} initialConfig={config || undefined} />
          </TabsContent>

          <TabsContent value="options">
            <WordPressExportOptions onOptionsSelected={handleOptionsSelected} initialOptions={options || undefined} />
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Progreso de exportación</span>
              <span>
                {progress.current} de {progress.total} ({progress.percent}%)
              </span>
            </div>
            <Progress value={progress.percent} className="h-2" />
          </div>
        )}

        {exportedUrls.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Contenidos exportados:</h3>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              <ul className="space-y-1">
                {exportedUrls.map((url, index) => (
                  <li key={index} className="text-sm">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleExport}
          disabled={isExporting || !config || !options || htmlContents.length === 0}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exportando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Exportar a WordPress
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
