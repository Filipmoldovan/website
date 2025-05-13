"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DownloadButton } from "@/components/ui/download-button"
import { BatchGenerator } from "@/components/batch-generator"
import { WordPressExporter } from "@/components/wordpress-exporter"
import { ciudades } from "@/data/ciudades-zonas"
import { todasLasMarcas, todasLasCategorias } from "@/data/marcas-dispositivos"
import { generarContenidoPagina } from "@/lib/generador-contenido"
import { Search } from "lucide-react"

export default function Home() {
  const [categoria, setCategoria] = useState("")
  const [marca, setMarca] = useState("")
  const [dispositivo, setDispositivo] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [generatedHtml, setGeneratedHtml] = useState("")
  const [activeTab, setActiveTab] = useState("generator")
  const [searchMarca, setSearchMarca] = useState("")
  const [searchCiudad, setSearchCiudad] = useState("")
  const [searchDispositivo, setSearchDispositivo] = useState("")
  const [generatedContents, setGeneratedContents] = useState<{ html: string; slug?: string }[]>([])

  // Obtener marcas filtradas por categoría y búsqueda
  const marcasFiltradas = categoria
    ? todasLasCategorias
        .find((cat) => cat.categoria === categoria)
        ?.marcas.filter((m) => m.nombre.toLowerCase().includes(searchMarca.toLowerCase())) || []
    : todasLasMarcas.filter((m) => m.nombre.toLowerCase().includes(searchMarca.toLowerCase()))

  // Obtener la marca seleccionada
  const marcaSeleccionada = todasLasMarcas.find((m) => m.nombre === marca)

  // Obtener dispositivos filtrados por marca y búsqueda
  const dispositivosFiltrados = marcaSeleccionada
    ? marcaSeleccionada.dispositivos.filter((d) => d.nombre.toLowerCase().includes(searchDispositivo.toLowerCase()))
    : []

  // Obtener ciudades filtradas por búsqueda
  const ciudadesFiltradas = ciudades.filter((c) => c.nombre.toLowerCase().includes(searchCiudad.toLowerCase()))

  // Obtener objetos completos
  const marcaObj = todasLasMarcas.find((m) => m.nombre === marca)
  const dispositivoObj = marcaObj?.dispositivos.find((d) => d.nombre === dispositivo)
  const ciudadObj = ciudades.find((c) => c.nombre === ciudad)

  const handleGenerate = () => {
    if (!marcaObj || !dispositivoObj || !ciudadObj) return

    const html = generarContenidoPagina(marcaObj, dispositivoObj, ciudadObj, todasLasMarcas)
    setGeneratedHtml(html)

    // Crear slug para WordPress
    const slug = `reparacion-${dispositivoObj.slug}-${marcaObj.slug}-${ciudadObj.slug}`

    // Añadir a la lista de contenidos generados
    setGeneratedContents([{ html, slug }])

    setActiveTab("preview")
  }

  const handleCopyHtml = () => {
    navigator.clipboard
      .writeText(generatedHtml)
      .then(() => {
        alert("HTML copiado al portapapeles")
      })
      .catch((err) => {
        console.error("Error al copiar: ", err)
      })
  }

  // Manejar contenidos generados por lotes
  const handleBatchGenerated = (contents: { html: string; slug?: string }[]) => {
    setGeneratedContents(contents)
    // Opcional: mostrar alguna notificación o cambiar a la pestaña de WordPress
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Generador de Páginas de Reparación de Electrodomésticos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Generador Individual</TabsTrigger>
          <TabsTrigger value="batch">Generador por Lotes</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Página</CardTitle>
              <CardDescription>
                Seleccione la marca, dispositivo y ciudad para generar una página única.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={categoria}
                  onValueChange={(value) => {
                    setCategoria(value)
                    setMarca("")
                    setDispositivo("")
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

              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar marca..."
                      value={searchMarca}
                      onChange={(e) => setSearchMarca(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select
                    value={marca}
                    onValueChange={(value) => {
                      setMarca(value)
                      setDispositivo("")
                    }}
                  >
                    <SelectTrigger id="marca" className="w-[180px]">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcasFiltradas.map((m) => (
                        <SelectItem key={m.nombre} value={m.nombre}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispositivo">Dispositivo</Label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar dispositivo..."
                      value={searchDispositivo}
                      onChange={(e) => setSearchDispositivo(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={dispositivo} onValueChange={setDispositivo}>
                    <SelectTrigger id="dispositivo" className="w-[180px]">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {dispositivosFiltrados.map((d) => (
                        <SelectItem key={d.nombre} value={d.nombre}>
                          {d.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar ciudad..."
                      value={searchCiudad}
                      onChange={(e) => setSearchCiudad(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={ciudad} onValueChange={setCiudad}>
                    <SelectTrigger id="ciudad" className="w-[180px]">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudadesFiltradas.map((c) => (
                        <SelectItem key={c.nombre} value={c.nombre}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} className="w-full" disabled={!marca || !dispositivo || !ciudad}>
                Generar Página
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <BatchGenerator onContentsGenerated={handleBatchGenerated} />
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de la Página</CardTitle>
              <CardDescription>
                Previsualización de la página generada para {dispositivo} {marca} en {ciudad}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-[500px] overflow-auto">
                {generatedHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                ) : (
                  <p className="text-center text-gray-500">Genera una página para ver la previsualización</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="html-code">Código HTML</Label>
                <Textarea id="html-code" value={generatedHtml} readOnly className="font-mono text-sm h-[200px]" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("generator")}>
                Volver al Generador
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleCopyHtml} disabled={!generatedHtml} variant="secondary">
                  Copiar HTML
                </Button>
                <DownloadButton html={generatedHtml} marca={marca} dispositivo={dispositivo} ciudad={ciudad} />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wordpress">
          <WordPressExporter htmlContents={generatedContents} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
