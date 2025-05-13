import { generateArticle } from "@/lib/article-generator"
import { generarContenidoPagina } from "@/lib/generador-contenido"
import { mockMarca, mockDispositivo, mockCiudad, mockMarcas } from "../mocks/test-data"
import { parseHtml, validateHtml, hasInvalidNesting, hasUnclosedElements } from "../utils/html-test-utils"

describe("Integración: Generación de artículos", () => {
  describe("generateArticle", () => {
    it("debe generar un artículo HTML válido", () => {
      const html = generateArticle(mockMarca.nombre, mockCiudad.nombre)

      // Verificar que es un documento HTML completo
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("<html")
      expect(html).toContain("<head>")
      expect(html).toContain("<body>")

      // Verificar que no hay elementos sin cerrar
      expect(hasUnclosedElements(html)).toBe(false)

      // Verificar que no hay anidamiento inválido
      const doc = parseHtml(html)
      expect(hasInvalidNesting(doc)).toBe(false)
    })

    it("debe incluir todas las secciones requeridas", () => {
      const html = generateArticle(mockMarca.nombre, mockCiudad.nombre)
      const doc = parseHtml(html)

      // Verificar secciones principales
      expect(doc.querySelector("h1")).not.toBeNull()
      expect(doc.querySelector(".call-to-action")).not.toBeNull()

      // Verificar que hay múltiples secciones
      const h2Elements = doc.querySelectorAll("h2")
      expect(h2Elements.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe("generarContenidoPagina", () => {
    it("debe generar una página HTML válida", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)

      // Verificar que es un documento HTML completo
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("<html")
      expect(html).toContain("<head>")
      expect(html).toContain("<body>")

      // Verificar que no hay elementos sin cerrar
      expect(hasUnclosedElements(html)).toBe(false)

      // Verificar que no hay anidamiento inválido
      const doc = parseHtml(html)
      expect(hasInvalidNesting(doc)).toBe(false)
    })

    it("debe incluir todas las secciones requeridas", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)
      const doc = parseHtml(html)

      // Verificar secciones principales
      expect(doc.querySelector("h1")).not.toBeNull()
      expect(doc.querySelector(".contacto-seccion")).not.toBeNull()

      // Verificar que hay múltiples secciones
      const h2Elements = doc.querySelectorAll("h2")
      expect(h2Elements.length).toBeGreaterThanOrEqual(3)
    })

    it("debe incluir información específica de marca, dispositivo y ciudad", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)
      const doc = parseHtml(html)

      const bodyText = doc.body.textContent || ""

      expect(bodyText).toContain(mockMarca.nombre)
      expect(bodyText).toContain(mockDispositivo.nombre)
      expect(bodyText).toContain(mockCiudad.nombre)
    })
  })

  describe("Comparación de generadores", () => {
    it("ambos generadores deben producir HTML válido", () => {
      const html1 = generateArticle(mockMarca.nombre, mockCiudad.nombre)
      const html2 = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)

      const validation1 = validateHtml(html1)
      const validation2 = validateHtml(html2)

      expect(validation1.isValid).toBe(true)
      expect(validation2.isValid).toBe(true)
    })
  })
})
