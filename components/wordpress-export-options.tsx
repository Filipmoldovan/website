"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, RefreshCw, Check } from "lucide-react"
import {
  wordPressService,
  type ExportOptions,
  type WordPressCategory,
  type WordPressTag,
  type WordPressUser,
  type WordPressMedia,
} from "@/lib/wordpress-service"

interface WordPressExportOptionsProps {
  onOptionsSelected: (options: ExportOptions) => void
  initialOptions?: ExportOptions
}

export function WordPressExportOptions({ onOptionsSelected, initialOptions }: WordPressExportOptionsProps) {
  const [options, setOptions] = useState<ExportOptions>(() => {
    // Usar opciones iniciales o valores predeterminados
    return (
      initialOptions || {
        postType: "page",
        status: "draft",
        convertToBlocks: true,
        addCustomFields: true,
        customFields: {},
      }
    )
  })

  const [categories, setCategories] = useState<WordPressCategory[]>([])
  const [tags, setTags] = useState<WordPressTag[]>([])
  const [users, setUsers] = useState<WordPressUser[]>([])
  const [media, setMedia] = useState<WordPressMedia[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  // Cargar datos de WordPress al montar el componente
  useEffect(() => {
    loadWordPressData()
  }, [])

  // Función para cargar datos de WordPress
  const loadWordPressData = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Verificar si hay configuración
      const config = wordPressService.getConfig()
      if (!config) {
        throw new Error("No hay configuración de WordPress. Configure la conexión primero.")
      }

      // Cargar categorías
      const loadedCategories = await wordPressService.loadCategories()
      setCategories(loadedCategories)

      // Cargar etiquetas
      const loadedTags = await wordPressService.loadTags()
      setTags(loadedTags)

      try {
        // Cargar usuarios (puede requerir autenticación)
        const loadedUsers = await wordPressService.loadUsers()
        setUsers(loadedUsers)
      } catch (userError) {
        console.warn("No se pudieron cargar los usuarios:", userError)
      }

      try {
        // Cargar medios (puede requerir autenticación)
        const loadedMedia = await wordPressService.loadMedia()
        setMedia(loadedMedia)
      } catch (mediaError) {
        console.warn("No se pudieron cargar los medios:", mediaError)
      }

      setSuccess("Datos cargados correctamente")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos de WordPress")
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambios en las opciones
  const handleOptionChange = (name: keyof ExportOptions, value: any) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [name]: value }
      onOptionsSelected(newOptions)
      return newOptions
    })
  }

  // Manejar cambio en el switch de convertir a bloques
  const handleSwitchChange = (name: keyof ExportOptions, checked: boolean) => {
    handleOptionChange(name, checked)
  }

  // Manejar selección de etiquetas
  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
      handleOptionChange("tagIds", newTags)
      return newTags
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Opciones de exportación a WordPress</CardTitle>
        <CardDescription>Configure cómo se exportará el contenido a su sitio WordPress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={loadWordPressData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar datos
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postType">Tipo de contenido</Label>
          <Select
            value={options.postType}
            onValueChange={(value) => handleOptionChange("postType", value as "post" | "page")}
          >
            <SelectTrigger id="postType">
              <SelectValue placeholder="Seleccione tipo de contenido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">Entrada</SelectItem>
              <SelectItem value="page">Página</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado de publicación</Label>
          <Select
            value={options.status}
            onValueChange={(value) => handleOptionChange("status", value as "publish" | "draft" | "private")}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publish">Publicado</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="private">Privado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={options.categoryId?.toString() || "0"}
            onValueChange={(value) => handleOptionChange("categoryId", value ? Number.parseInt(value) : undefined)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccione categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sin categoría</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {users.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Select
              value={options.author?.toString() || "0"}
              onValueChange={(value) => handleOptionChange("author", value ? Number.parseInt(value) : undefined)}
            >
              <SelectTrigger id="author">
                <SelectValue placeholder="Seleccione autor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Autor predeterminado</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {media.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="featuredMedia">Imagen destacada</Label>
            <Select
              value={options.featuredMediaId?.toString() || "0"}
              onValueChange={(value) =>
                handleOptionChange("featuredMediaId", value ? Number.parseInt(value) : undefined)
              }
            >
              <SelectTrigger id="featuredMedia">
                <SelectValue placeholder="Seleccione imagen destacada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin imagen destacada</SelectItem>
                {media
                  .filter((item) => item.media_type === "image")
                  .map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.title.rendered || `Imagen #${item.id}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="convertToBlocks"
            checked={options.convertToBlocks}
            onCheckedChange={(checked) => handleSwitchChange("convertToBlocks", checked)}
          />
          <Label htmlFor="convertToBlocks">Convertir a bloques de Gutenberg</Label>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="addCustomFields"
            checked={options.addCustomFields}
            onCheckedChange={(checked) => handleSwitchChange("addCustomFields", checked)}
          />
          <Label htmlFor="addCustomFields">Añadir campos personalizados (marca, dispositivo, ciudad)</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onOptionsSelected(options)} className="w-full">
          Aplicar opciones
        </Button>
      </CardFooter>
    </Card>
  )
}
