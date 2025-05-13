import JSZip from "jszip"
import type { Marca, Dispositivo } from "@/data/marcas-dispositivos"
import type { Ciudad } from "@/data/ciudades-zonas"

// Definir la estructura de una tarea de generación
export interface GenerationTask {
  marca: Marca
  dispositivo: Dispositivo
  ciudad: Ciudad
}

// Definir la estructura de un resultado de generación
export interface GenerationResult {
  html: string
  filename: string
  marcaSlug: string
  dispositivoSlug: string
  ciudadSlug: string
  marca: string
  dispositivo: string
  ciudad: string
}

// Definir los callbacks para el progreso y la finalización
export interface BatchCallbacks {
  onProgress: (current: number, total: number) => void
  onComplete: (zipBlob: Blob, results: GenerationResult[]) => void
  onError: (error: Error) => void
}

// Clase para gestionar la generación por lotes
export class BatchService {
  private worker: Worker | null = null
  private tasks: GenerationTask[] = []
  private results: GenerationResult[] = []
  private callbacks: BatchCallbacks
  private isRunning = false
  private isCancelled = false
  private batchSize = 10
  private currentIndex = 0
  private totalTasks = 0
  private todasLasMarcas: Marca[] = []

  constructor(callbacks: BatchCallbacks) {
    this.callbacks = callbacks
  }

  // Inicializar el worker
  private initWorker() {
    if (typeof window === "undefined") return

    if (this.worker) {
      this.worker.terminate()
    }

    // Crear un nuevo worker
    this.worker = new Worker(new URL("../workers/html-generator.worker.ts", import.meta.url))

    // Configurar el listener para los mensajes del worker
    this.worker.onmessage = (event) => {
      const message = event.data

      if (message.type === "HTML_GENERATED") {
        this.handleHtmlGenerated(message)
      } else if (message.type === "PROGRESS") {
        this.callbacks.onProgress(message.index, message.total)
      }
    }

    // Configurar el listener para errores del worker
    this.worker.onerror = (error) => {
      console.error("Worker error:", error)
      this.callbacks.onError(new Error("Error en el procesamiento del worker"))
      this.cleanup()
    }
  }

  // Manejar el HTML generado por el worker
  private handleHtmlGenerated(message: any) {
    // Añadir el resultado a la lista
    this.results.push({
      html: message.html,
      filename: message.filename,
      marcaSlug: message.marcaSlug,
      dispositivoSlug: message.dispositivoSlug,
      ciudadSlug: message.ciudadSlug,
      marca: message.marca,
      dispositivo: message.dispositivo,
      ciudad: message.ciudad,
    })

    // Actualizar el progreso
    this.currentIndex++
    this.callbacks.onProgress(this.currentIndex, this.totalTasks)

    // Procesar el siguiente lote si es necesario
    if (this.currentIndex < this.totalTasks && !this.isCancelled) {
      this.processNextBatch()
    } else if (this.currentIndex >= this.totalTasks || this.isCancelled) {
      this.finalizeBatch()
    }
  }

  // Procesar el siguiente lote de tareas
  private processNextBatch() {
    const startIdx = this.currentIndex
    const endIdx = Math.min(startIdx + this.batchSize, this.totalTasks)

    for (let i = startIdx; i < endIdx; i++) {
      if (this.isCancelled) break

      const task = this.tasks[i]
      if (!task) continue

      // Enviar la tarea al worker
      this.worker?.postMessage({
        type: "GENERATE_HTML",
        marca: task.marca,
        dispositivo: task.dispositivo,
        ciudad: task.ciudad,
        todasLasMarcas: this.todasLasMarcas,
        index: i,
        total: this.totalTasks,
      })
    }
  }

  // Finalizar el proceso de generación por lotes
  private async finalizeBatch() {
    if (!this.results.length) {
      this.callbacks.onError(new Error("No se generaron resultados"))
      this.cleanup()
      return
    }

    try {
      // Crear un archivo ZIP con los resultados
      const zip = new JSZip()

      // Organizar los archivos en carpetas por marca y dispositivo
      this.results.forEach((result) => {
        const folder = zip.folder(result.marcaSlug)?.folder(result.dispositivoSlug)
        if (folder) {
          folder.file(result.filename, result.html)
        }
      })

      // Generar el archivo ZIP
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 5, // Nivel medio de compresión para equilibrar velocidad y tamaño
        },
      })

      // Llamar al callback de finalización
      this.callbacks.onComplete(zipBlob, this.results)
    } catch (error) {
      console.error("Error al generar el ZIP:", error)
      this.callbacks.onError(error instanceof Error ? error : new Error("Error al generar el archivo ZIP"))
    } finally {
      this.cleanup()
    }
  }

  // Limpiar recursos
  private cleanup() {
    this.isRunning = false
    this.worker?.terminate()
    this.worker = null
    this.tasks = []
    this.results = []
    this.currentIndex = 0
    this.totalTasks = 0
    this.isCancelled = false
  }

  // Iniciar la generación por lotes
  public start(tasks: GenerationTask[], todasLasMarcas: Marca[], batchSize = 10) {
    if (this.isRunning) {
      throw new Error("Ya hay un proceso de generación en curso")
    }

    this.tasks = tasks
    this.totalTasks = tasks.length
    this.todasLasMarcas = todasLasMarcas
    this.batchSize = batchSize
    this.isRunning = true
    this.isCancelled = false
    this.currentIndex = 0
    this.results = []

    // Inicializar el worker
    this.initWorker()

    // Iniciar el procesamiento
    this.processNextBatch()
  }

  // Cancelar la generación por lotes
  public cancel() {
    if (!this.isRunning) return

    this.isCancelled = true
    this.callbacks.onError(new Error("Proceso cancelado por el usuario"))
    this.cleanup()
  }

  // Verificar si el servicio está en ejecución
  public isActive() {
    return this.isRunning
  }
}
