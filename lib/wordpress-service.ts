// Tipos para la configuración de WordPress
export interface WordPressConfig {
  siteUrl: string
  username: string
  password: string
  applicationPassword?: string
  useApplicationPassword: boolean
}

// Tipos para las opciones de exportación
export interface ExportOptions {
  postType: "post" | "page"
  status: "publish" | "draft" | "private"
  categoryId?: number
  tagIds?: number[]
  author?: number
  featuredMediaId?: number
  convertToBlocks?: boolean
  addCustomFields?: boolean
  customFields?: {
    marca?: string
    dispositivo?: string
    ciudad?: string
    zonas?: string[]
  }
}

// Tipos para la respuesta de la API
interface WordPressApiResponse {
  id: number
  link: string
  title: { rendered: string }
  status: string
}

// Tipos para categorías y etiquetas
export interface WordPressCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface WordPressTag {
  id: number
  name: string
  slug: string
  count: number
}

export interface WordPressUser {
  id: number
  name: string
  slug: string
}

export interface WordPressMedia {
  id: number
  title: { rendered: string }
  source_url: string
  media_type: string
}

// Clase para manejar la comunicación con WordPress
export class WordPressService {
  private config: WordPressConfig | null = null
  private categories: WordPressCategory[] = []
  private tags: WordPressTag[] = []
  private users: WordPressUser[] = []
  private media: WordPressMedia[] = []
  private isConnected = false

  // Establecer la configuración
  public setConfig(config: WordPressConfig): void {
    // Asegurarse de que la URL tenga el formato correcto
    let url = config.siteUrl
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }

    // Eliminar la barra final si existe
    if (url.endsWith("/")) {
      url = url.slice(0, -1)
    }

    this.config = {
      ...config,
      siteUrl: url,
    }
    this.isConnected = false
  }

  // Obtener la configuración actual
  public getConfig(): WordPressConfig | null {
    return this.config
  }

  // Verificar la conexión con WordPress
  public async verifyConnection(): Promise<boolean> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      // Primero verificamos que la API REST esté disponible
      const response = await fetch(`${this.config.siteUrl}/wp-json/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al conectar con WordPress: ${response.statusText}`)
      }

      const data = await response.json()

      // Verificar que es un sitio WordPress
      if (!data.name || !data.namespaces || !data.namespaces.includes("wp/v2")) {
        throw new Error("El sitio no parece ser un WordPress válido o no tiene la API REST habilitada")
      }

      // Ahora verificamos las credenciales
      if (this.config.useApplicationPassword && this.config.applicationPassword) {
        // Verificar con contraseña de aplicación
        const authResponse = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/users/me`, {
          method: "GET",
          headers: this.getAuthHeaders(),
          cache: "no-store",
        })

        if (!authResponse.ok) {
          throw new Error(`Error de autenticación: ${authResponse.statusText}`)
        }
      }

      this.isConnected = true
      return true
    } catch (error) {
      this.isConnected = false
      console.error("Error al verificar la conexión:", error)
      throw error
    }
  }

  // Obtener las credenciales para la autenticación
  private getAuthHeaders(): Headers {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Accept", "application/json")

    if (this.config.useApplicationPassword && this.config.applicationPassword) {
      // Usar contraseña de aplicación (método recomendado)
      const credentials = btoa(`${this.config.username}:${this.config.applicationPassword}`)
      headers.append("Authorization", `Basic ${credentials}`)
    } else {
      // Usar autenticación básica (menos seguro, solo para desarrollo)
      const credentials = btoa(`${this.config.username}:${this.config.password}`)
      headers.append("Authorization", `Basic ${credentials}`)
    }

    return headers
  }

  // Cargar categorías desde WordPress
  public async loadCategories(): Promise<WordPressCategory[]> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/categories?per_page=100`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.statusText}`)
      }

      this.categories = await response.json()
      return this.categories
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      throw error
    }
  }

  // Cargar etiquetas desde WordPress
  public async loadTags(): Promise<WordPressTag[]> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/tags?per_page=100`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar etiquetas: ${response.statusText}`)
      }

      this.tags = await response.json()
      return this.tags
    } catch (error) {
      console.error("Error al cargar etiquetas:", error)
      throw error
    }
  }

  // Cargar usuarios desde WordPress
  public async loadUsers(): Promise<WordPressUser[]> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/users?per_page=100`, {
        headers: this.getAuthHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.statusText}`)
      }

      this.users = await response.json()
      return this.users
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      throw error
    }
  }

  // Cargar medios desde WordPress
  public async loadMedia(): Promise<WordPressMedia[]> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/media?per_page=50`, {
        headers: this.getAuthHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar medios: ${response.statusText}`)
      }

      this.media = await response.json()
      return this.media
    } catch (error) {
      console.error("Error al cargar medios:", error)
      throw error
    }
  }

  // Crear una categoría en WordPress
  public async createCategory(name: string, description = ""): Promise<WordPressCategory> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/categories`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al crear categoría: ${response.statusText}`)
      }

      const newCategory = await response.json()
      this.categories.push(newCategory)
      return newCategory
    } catch (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }
  }

  // Crear una etiqueta en WordPress
  public async createTag(name: string, description = ""): Promise<WordPressTag> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/tags`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al crear etiqueta: ${response.statusText}`)
      }

      const newTag = await response.json()
      this.tags.push(newTag)
      return newTag
    } catch (error) {
      console.error("Error al crear etiqueta:", error)
      throw error
    }
  }

  // Convertir HTML a bloques de Gutenberg
  private convertHtmlToBlocks(html: string): string {
    // Esta es una implementación básica
    // Para una conversión más robusta, se podría usar una biblioteca como @wordpress/blocks
    return `<!-- wp:html -->${html}<!-- /wp:html -->`
  }

  // Extraer el título del HTML
  private extractTitleFromHtml(html: string): string {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1]
    }

    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (h1Match && h1Match[1]) {
      // Eliminar cualquier etiqueta HTML dentro del h1
      return h1Match[1].replace(/<\/?[^>]+(>|$)/g, "")
    }

    return "Página sin título"
  }

  // Extraer el contenido del body del HTML
  private extractContentFromHtml(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1]
    }
    return html
  }

  // Extraer metadatos del HTML
  private extractMetadataFromHtml(html: string): {
    title: string
    description: string
    keywords: string[]
    marca?: string
    dispositivo?: string
    ciudad?: string
  } {
    const metadata = {
      title: this.extractTitleFromHtml(html),
      description: "",
      keywords: [],
      marca: undefined,
      dispositivo: undefined,
      ciudad: undefined,
    }

    // Extraer meta description
    const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
    if (descriptionMatch && descriptionMatch[1]) {
      metadata.description = descriptionMatch[1]
    }

    // Extraer meta keywords
    const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i)
    if (keywordsMatch && keywordsMatch[1]) {
      metadata.keywords = keywordsMatch[1].split(",").map((k) => k.trim())
    }

    // Intentar extraer marca, dispositivo y ciudad del título o keywords
    if (metadata.title) {
      // Buscar patrones comunes en el título
      const titleParts = metadata.title.split(" ")

      // Buscar "Reparación de [dispositivo] [marca] en [ciudad]"
      const repairPattern = /Reparación\s+de\s+(\w+)\s+(\w+)\s+en\s+(\w+)/i
      const repairMatch = metadata.title.match(repairPattern)

      if (repairMatch) {
        metadata.dispositivo = repairMatch[1]
        metadata.marca = repairMatch[2]
        metadata.ciudad = repairMatch[3]
      }

      // Si no se encontró con el patrón, intentar extraer de keywords
      if (metadata.keywords.length > 0) {
        for (const keyword of metadata.keywords) {
          if (keyword.includes("servicio técnico") || keyword.includes("reparación")) {
            const parts = keyword.split(" ")
            for (let i = 0; i < parts.length; i++) {
              if (parts[i] === "técnico" || parts[i] === "reparación") {
                if (i + 1 < parts.length) metadata.marca = parts[i + 1]
              }
              if (parts[i] === "en") {
                if (i + 1 < parts.length) metadata.ciudad = parts[i + 1]
              }
            }
          }
        }
      }
    }

    return metadata
  }

  // Publicar contenido en WordPress
  public async publishContent(html: string, options: ExportOptions, slug?: string): Promise<WordPressApiResponse> {
    if (!this.config) {
      throw new Error("La configuración de WordPress no está establecida")
    }

    if (!this.isConnected) {
      await this.verifyConnection()
    }

    try {
      // Extraer metadatos del HTML
      const metadata = this.extractMetadataFromHtml(html)

      // Extraer contenido del HTML
      let content = this.extractContentFromHtml(html)

      // Convertir a bloques de Gutenberg si es necesario
      if (options.convertToBlocks) {
        content = this.convertHtmlToBlocks(content)
      }

      // Preparar los datos para la API
      const postData: any = {
        title: metadata.title,
        content,
        status: options.status,
        excerpt: metadata.description,
      }

      // Añadir slug personalizado si se proporciona
      if (slug) {
        postData.slug = slug
      }

      // Añadir categoría si se proporciona
      if (options.categoryId) {
        postData.categories = [options.categoryId]
      }

      // Añadir etiquetas si se proporcionan
      if (options.tagIds && options.tagIds.length > 0) {
        postData.tags = options.tagIds
      }

      // Añadir autor si se proporciona
      if (options.author) {
        postData.author = options.author
      }

      // Añadir imagen destacada si se proporciona
      if (options.featuredMediaId) {
        postData.featured_media = options.featuredMediaId
      }

      // Añadir campos personalizados si se solicita
      if (options.addCustomFields) {
        postData.meta = {}

        // Usar metadatos extraídos o proporcionados en las opciones
        if (options.customFields?.marca || metadata.marca) {
          postData.meta.marca = options.customFields?.marca || metadata.marca
        }

        if (options.customFields?.dispositivo || metadata.dispositivo) {
          postData.meta.dispositivo = options.customFields?.dispositivo || metadata.dispositivo
        }

        if (options.customFields?.ciudad || metadata.ciudad) {
          postData.meta.ciudad = options.customFields?.ciudad || metadata.ciudad
        }

        if (options.customFields?.zonas && options.customFields.zonas.length > 0) {
          postData.meta.zonas = options.customFields.zonas.join(", ")
        }
      }

      // Realizar la solicitud a la API
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/${options.postType}s`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al publicar contenido: ${errorData.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error al publicar contenido:", error)
      throw error
    }
  }

  // Publicar múltiples contenidos en WordPress
  public async publishMultipleContents(
    contents: { html: string; slug?: string }[],
    options: ExportOptions,
    progressCallback?: (current: number, total: number) => void,
  ): Promise<WordPressApiResponse[]> {
    const results: WordPressApiResponse[] = []
    const total = contents.length

    // Verificar conexión antes de comenzar
    if (!this.isConnected) {
      await this.verifyConnection()
    }

    for (let i = 0; i < total; i++) {
      try {
        const result = await this.publishContent(contents[i].html, options, contents[i].slug)
        results.push(result)

        // Llamar al callback de progreso si se proporciona
        if (progressCallback) {
          progressCallback(i + 1, total)
        }

        // Pequeña pausa para evitar sobrecargar la API
        if (i < total - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error(`Error al publicar contenido ${i + 1}/${total}:`, error)
        // Continuar con el siguiente contenido en caso de error
      }
    }

    return results
  }
}

// Exportar una instancia única del servicio
export const wordPressService = new WordPressService()
