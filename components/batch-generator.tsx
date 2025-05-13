"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ciudades } from "@/data/ciudades-zonas"
import { todasLasMarcas, todasLasCategorias, type Dispositivo } from "@/data/marcas-dispositivos"
import { Download, Loader2, X, Upload } from "lucide-react"
import FileSaver from "file-saver"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BatchService, type GenerationTask } from "@/lib/batch-service"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"

interface BatchGeneratorProps {
  onContentsGenerated?: (contents: { html: string; slug?: string }[]) => void
}

export function BatchGenerator({ onContentsGenerated }: BatchGeneratorProps) {
  const [categoria, setCategoria] = useState("")
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([])
  const [selectedDispositivos, setSelectedDispositivos] = useState<string[]>([])
  const [selectedCiudades, setSelectedCiudades] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 })
  const [searchMarca, setSearchMarca] = useState("")
  const [searchDispositivo, setSearchDispositivo] = useState("")
  const [searchCiudad, setSearchCiudad] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [batchSize, setBatchSize] = useState(10)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null)
  const [generatedContents, setGeneratedContents] = useState<{ html: string; slug?: string }[]>([])
  const [success, setSuccess] = useState<string | null>(null)

  // Referencia al servicio de generación por lotes
  const batchServiceRef = useRef<BatchService | null>(null)

  // Inicializar el servicio de generación por lotes
  useEffect(() => {
    batchServiceRef.current = new BatchService({
      onProgress: (current, total) => {
        const percent = Math.round((current / total) * 100)
        setProgress({ current, total, percent })

        // Calcular tiempo estimado restante
        if (startTime && current > 0) {
          const elapsedTime = Date.now() - startTime
          const timePerItem = elapsedTime / current
          const remainingItems = total - current
          const estimatedRemainingTime = timePerItem * remainingItems
          setEstimatedTime(Math.round(estimatedRemainingTime / 1000)) // en segundos
        }

        // Actualizar uso de memoria si está disponible
        if (window.performance && "memory" in window.performance) {
          const memory = (window.performance as any).memory
          if (memory && memory.usedJSHeapSize) {
            setMemoryUsage(Math.round(memory.usedJSHeapSize / (1024 * 1024))) // en MB
          }
        }
      },
      onComplete: (zipBlob, results) => {
        FileSaver.saveAs(zipBlob, "paginas-reparacion-electrodomesticos.zip")
        setIsGenerating(false)
        setStartTime(null)
        setEstimatedTime(null)
        setMemoryUsage(null)
        setSuccess(`Se han generado ${results.length} páginas correctamente`)

        // Actualizar los contenidos generados con el HTML real
        const updatedContents = generatedContents.map((content, index) => ({
          ...content,
          html: results[index]?.html || content.html,
        }))

        setGeneratedContents(updatedContents)

        // Notificar al componente padre sobre los contenidos generados
        if (onContentsGenerated && updatedContents.length > 0) {
          onContentsGenerated(updatedContents)
        }
      },
      onError: (error) => {
        setError(error.message)
        setIsGenerating(false)
        setStartTime(null)
        setEstimatedTime(null)
        setMemoryUsage(null)
      },
    })

    return () => {
      // Cancelar cualquier proceso en curso al desmontar el componente
      if (batchServiceRef.current?.isActive()) {
        batchServiceRef.current.cancel()
      }
    }
  }, [generatedContents, onContentsGenerated])

  // Obtener marcas filtradas por categoría y búsqueda
  const marcasFiltradas = categoria
    ? todasLasCategorias
        .find((cat) => cat.categoria === categoria)
        ?.marcas.filter((m) => m.nombre.toLowerCase().includes(searchMarca.toLowerCase())) || []
    : todasLasMarcas.filter((m) => m.nombre.toLowerCase().includes(searchMarca.toLowerCase()))

  // Obtener todos los dispositivos únicos de las marcas seleccionadas
  const todosLosDispositivos: Dispositivo[] = []
  todasLasMarcas
    .filter((m) => selectedMarcas.includes(m.nombre))
    .forEach((marca) => {
      marca.dispositivos.forEach((dispositivo) => {
        if (!todosLosDispositivos.some((d) => d.nombre === dispositivo.nombre)) {
          todosLosDispositivos.push(dispositivo)
        }
      })
    })

  // Filtrar dispositivos por búsqueda
  const dispositivosFiltrados = todosLosDispositivos.filter((d) =>
    d.nombre.toLowerCase().includes(searchDispositivo.toLowerCase()),
  )

  // Obtener ciudades filtradas por búsqueda
  const ciudadesFiltradas = ciudades.filter((c) => c.nombre.toLowerCase().includes(searchCiudad.toLowerCase()))

  const toggleMarca = (marca: string) => {
    setSelectedMarcas((prev) => (prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]))
  }

  const toggleDispositivo = (dispositivo: string) => {
    setSelectedDispositivos((prev) =>
      prev.includes(dispositivo) ? prev.filter((d) => d !== dispositivo) : [...prev, dispositivo],
    )
  }

  const toggleCiudad = (ciudad: string) => {
    setSelectedCiudades((prev) => (prev.includes(ciudad) ? prev.filter((c) => c !== ciudad) : [...prev, ciudad]))
  }

  const selectAllMarcas = () => {
    if (selectedMarcas.length === marcasFiltradas.length) {
      setSelectedMarcas([])
    } else {
      setSelectedMarcas(marcasFiltradas.map((m) => m.nombre))
    }
  }

  const selectAllDispositivos = () => {
    if (selectedDispositivos.length === dispositivosFiltrados.length) {
      setSelectedDispositivos([])
    } else {
      setSelectedDispositivos(dispositivosFiltrados.map((d) => d.nombre))
    }
  }

  const selectAllCiudades = () => {
    if (selectedCiudades.length === ciudadesFiltradas.length) {
      setSelectedCiudades([])
    } else {
      setSelectedCiudades(ciudadesFiltradas.map((c) => c.nombre))
    }
  }

  const handleGenerateBatch = async () => {
    if (selectedMarcas.length === 0 || selectedDispositivos.length === 0 || selectedCiudades.length === 0) return
    if (!batchServiceRef.current) return

    setIsGenerating(true)
    setError(null)
    setSuccess(null)
    setProgress({ current: 0, total: 0, percent: 0 })
    setStartTime(Date.now())

    // Limpiar contenidos generados anteriores
    setGeneratedContents([])

    // Crear las tareas de generación
    const tasks: GenerationTask[] = []
    const contents: { html: string; slug?: string }[] = []

    selectedMarcas.forEach((marcaNombre) => {
      const marca = todasLasMarcas.find((m) => m.nombre === marcaNombre)
      if (!marca) return

      selectedDispositivos.forEach((dispositivoNombre) => {
        const dispositivo = marca.dispositivos.find((d) => d.nombre === dispositivoNombre)
        if (!dispositivo) return

        selectedCiudades.forEach((ciudadNombre) => {
          const ciudad = ciudades.find((c) => c.nombre === ciudadNombre)
          if (!ciudad) return

          tasks.push({ marca, dispositivo, ciudad })

          // Crear slug para WordPress
          const slug = `reparacion-${dispositivo.slug}-${marca.slug}-${ciudad.slug}`

          // Añadir a la lista de contenidos (el HTML se generará después)
          contents.push({
            html: "",
            slug,
          })
        })
      })
    })

    // Actualizar el total de tareas
    setProgress({ current: 0, total: tasks.length, percent: 0 })

    // Guardar los contenidos para notificar al componente padre después
    setGeneratedContents(contents)

    // Iniciar la generación por lotes
    try {
      batchServiceRef.current.start(tasks, todasLasMarcas, batchSize)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar la generación")
      setIsGenerating(false)
    }
  }

  const handleCancelGeneration = () => {
    if (batchServiceRef.current?.isActive()) {
      batchServiceRef.current.cancel()
    }
  }

  // Formatear el tiempo estimado
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} segundos`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos ${seconds % 60} segundos`
    return `${Math.floor(seconds / 3600)} horas ${Math.floor((seconds % 3600) / 60)} minutos`
  }

  // Manejar la exportación a WordPress
  const handleExportToWordPress = () => {
    if (onContentsGenerated && generatedContents.length > 0) {
      onContentsGenerated(generatedContents)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generación por Lotes</CardTitle>
        <CardDescription>
          Genera múltiples páginas a la vez seleccionando varias marcas, dispositivos y ciudades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            value={categoria}
            onValueChange={(value) => {
              setCategoria(value)
              setSelectedMarcas([])
              setSelectedDispositivos([])
            }}
          >
            <SelectTrigger id="categoria">
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {todasLasCategorias.map((cat) => (
                <SelectItem key={cat.categoria} value={cat.categoria}>
                  {cat.categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Marcas</Label>
            <Button variant="outline" size="sm" onClick={selectAllMarcas} className="text-xs">
              {selectedMarcas.length === marcasFiltradas.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          </div>
          <Input
            placeholder="Buscar marca..."
            value={searchMarca}
            onChange={(e) => setSearchMarca(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
            {marcasFiltradas.map((marca) => (
              <div key={marca.nombre} className="flex items-center space-x-2">
                <Checkbox
                  id={`marca-${marca.slug}`}
                  checked={selectedMarcas.includes(marca.nombre)}
                  onCheckedChange={() => toggleMarca(marca.nombre)}
                />
                <Label htmlFor={`marca-${marca.slug}`} className="text-sm">
                  {marca.nombre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Dispositivos</Label>
            <Button variant="outline" size="sm" onClick={selectAllDispositivos} className="text-xs">
              {selectedDispositivos.length === dispositivosFiltrados.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          </div>
          <Input
            placeholder="Buscar dispositivo..."
            value={searchDispositivo}
            onChange={(e) => setSearchDispositivo(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
            {dispositivosFiltrados.map((dispositivo) => (
              <div key={dispositivo.nombre} className="flex items-center space-x-2">
                <Checkbox
                  id={`dispositivo-${dispositivo.slug}`}
                  checked={selectedDispositivos.includes(dispositivo.nombre)}
                  onCheckedChange={() => toggleDispositivo(dispositivo.nombre)}
                />
                <Label htmlFor={`dispositivo-${dispositivo.slug}`} className="text-sm">
                  {dispositivo.nombre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Ciudades</Label>
            <Button variant="outline" size="sm" onClick={selectAllCiudades} className="text-xs">
              {selectedCiudades.length === ciudadesFiltradas.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          </div>
          <Input
            placeholder="Buscar ciudad..."
            value={searchCiudad}
            onChange={(e) => setSearchCiudad(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
            {ciudadesFiltradas.map((ciudad) => (
              <div key={ciudad.nombre} className="flex items-center space-x-2">
                <Checkbox
                  id={`ciudad-${ciudad.slug}`}
                  checked={selectedCiudades.includes(ciudad.nombre)}
                  onCheckedChange={() => toggleCiudad(ciudad.nombre)}
                />
                <Label htmlFor={`ciudad-${ciudad.slug}`} className="text-sm">
                  {ciudad.nombre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="batch-size" className="text-base font-medium">
              Tamaño del lote (procesamiento simultáneo)
            </Label>
            <span className="text-sm font-medium">{batchSize}</span>
          </div>
          <Slider
            id="batch-size"
            min={1}
            max={50}
            step={1}
            value={[batchSize]}
            onValueChange={(value) => setBatchSize(value[0])}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Un valor más alto puede acelerar el proceso pero consumirá más recursos. Recomendado: 5-20.
          </p>
        </div>

        {isGenerating && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Progreso</Label>
                <span className="text-sm font-medium">{progress.percent}%</span>
              </div>
              <Progress value={progress.percent} className="h-2" />
              <p className="text-sm text-center text-gray-500">
                Generando {progress.current} de {progress.total} páginas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {estimatedTime !== null && (
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">Tiempo restante estimado:</p>
                  <p>{formatTime(estimatedTime)}</p>
                </div>
              )}

              {startTime !== null && (
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">Tiempo transcurrido:</p>
                  <p>{formatTime(Math.round((Date.now() - startTime) / 1000))}</p>
                </div>
              )}

              {memoryUsage !== null && (
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">Uso de memoria:</p>
                  <p>{memoryUsage} MB</p>
                </div>
              )}
            </div>

            <Button variant="destructive" size="sm" onClick={handleCancelGeneration} className="w-full">
              <X className="h-4 w-4 mr-2" /> Cancelar generación
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleGenerateBatch}
          disabled={
            isGenerating ||
            selectedMarcas.length === 0 ||
            selectedDispositivos.length === 0 ||
            selectedCiudades.length === 0
          }
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generar y Descargar ({selectedMarcas.length * selectedDispositivos.length * selectedCiudades.length}{" "}
              páginas)
            </>
          )}
        </Button>

        {generatedContents.length > 0 && (
          <Button onClick={handleExportToWordPress} variant="secondary" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Exportar a WordPress
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
