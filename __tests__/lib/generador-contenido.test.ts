import {
  generarTitulo,
  generarMetaDescripcion,
  generarIntroduccion,
  generarProblemasComunes,
  generarZonasServicio,
  generarServiciosDisponibles,
  generarProcesoReparacion,
  generarVentajas,
  generarDispositivosRelacionados,
  generarMarcasRelacionadas,
  generarInformacionAdicional,
  generarContacto,
  generarContenidoPagina,
} from "@/lib/generador-contenido"

import { mockMarca, mockDispositivo, mockCiudad, mockMarcas, type Marca } from "../mocks/test-data"
import {
  parseHtml,
  validateHtml,
  countElements,
  elementExists,
  hasInvalidNesting,
  hasUnclosedElements,
} from "../utils/html-test-utils"

describe("Funciones de generación de contenido", () => {
  describe("generarTitulo", () => {
    it("debe generar un título que incluya marca, dispositivo y ciudad", () => {
      const titulo = generarTitulo(mockMarca, mockDispositivo, mockCiudad)

      expect(titulo).toContain(mockMarca.nombre)
      expect(titulo).toContain(mockDispositivo.nombre)
      expect(titulo).toContain(mockCiudad.nombre)
    })
  })

  describe("generarMetaDescripcion", () => {
    it("debe generar una meta descripción que incluya marca, dispositivo y ciudad", () => {
      const metaDescripcion = generarMetaDescripcion(mockMarca, mockDispositivo, mockCiudad)

      expect(metaDescripcion).toContain(mockMarca.nombre)
      expect(metaDescripcion).toContain(mockDispositivo.nombre)
      expect(metaDescripcion).toContain(mockCiudad.nombre)
    })
  })

  describe("generarIntroduccion", () => {
    it("debe generar HTML válido", () => {
      const html = generarIntroduccion(mockMarca, mockDispositivo, mockCiudad)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir etiquetas <strong> para marca, dispositivo y ciudad", () => {
      const html = generarIntroduccion(mockMarca, mockDispositivo, mockCiudad)
      const doc = parseHtml(html)

      const strongElements = doc.querySelectorAll("strong")
      expect(strongElements.length).toBeGreaterThanOrEqual(2)

      let containsMarca = false
      let containsDispositivo = false
      let containsCiudad = false

      strongElements.forEach((el) => {
        const text = el.textContent || ""
        if (text.includes(mockMarca.nombre)) containsMarca = true
        if (text.includes(mockDispositivo.nombre)) containsDispositivo = true
        if (text.includes(mockCiudad.nombre)) containsCiudad = true
      })

      expect(containsMarca || containsDispositivo).toBe(true)
      expect(containsCiudad).toBe(true)
    })
  })

  describe("generarProblemasComunes", () => {
    it("debe generar HTML válido", () => {
      const html = generarProblemasComunes(mockDispositivo)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir una lista con al menos un problema común", () => {
      const html = generarProblemasComunes(mockDispositivo)
      const doc = parseHtml(html)

      expect(elementExists(doc, "ul")).toBe(true)
      expect(countElements(doc, "li")).toBeGreaterThanOrEqual(1)
    })

    it("no debe tener anidamiento inválido", () => {
      const html = generarProblemasComunes(mockDispositivo)
      const doc = parseHtml(html)

      expect(hasInvalidNesting(doc)).toBe(false)
    })
  })

  describe("generarZonasServicio", () => {
    it("debe generar HTML válido", () => {
      const html = generarZonasServicio(mockCiudad)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir todas las zonas de la ciudad", () => {
      const html = generarZonasServicio(mockCiudad)
      const doc = parseHtml(html)

      const zonaElements = countElements(doc, ".zona-item")
      expect(zonaElements).toBe(mockCiudad.zonas.length)

      mockCiudad.zonas.forEach((zona) => {
        expect(doc.body.textContent).toContain(zona)
      })
    })

    it("no debe tener anidamiento inválido", () => {
      const html = generarZonasServicio(mockCiudad)
      const doc = parseHtml(html)

      expect(hasInvalidNesting(doc)).toBe(false)
    })
  })

  describe("generarServiciosDisponibles", () => {
    it("debe generar HTML válido", () => {
      const html = generarServiciosDisponibles(mockCiudad)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir todos los servicios disponibles", () => {
      const html = generarServiciosDisponibles(mockCiudad)
      const doc = parseHtml(html)

      const servicioElements = countElements(doc, ".servicio-item")
      expect(servicioElements).toBe(mockCiudad.servicios_disponibles.length)

      mockCiudad.servicios_disponibles.forEach((servicio) => {
        expect(doc.body.textContent).toContain(servicio)
      })
    })
  })

  describe("generarProcesoReparacion", () => {
    it("debe generar HTML válido", () => {
      const html = generarProcesoReparacion()
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir al menos 3 pasos en el proceso", () => {
      const html = generarProcesoReparacion()
      const doc = parseHtml(html)

      const pasoElements = countElements(doc, ".proceso-paso")
      expect(pasoElements).toBeGreaterThanOrEqual(3)
    })

    it("debe incluir números de paso y títulos", () => {
      const html = generarProcesoReparacion()
      const doc = parseHtml(html)

      expect(elementExists(doc, ".paso-numero")).toBe(true)
      expect(elementExists(doc, ".paso-contenido h3")).toBe(true)
    })
  })

  describe("generarVentajas", () => {
    it("debe generar HTML válido", () => {
      const html = generarVentajas(mockMarca)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir al menos 3 ventajas", () => {
      const html = generarVentajas(mockMarca)
      const doc = parseHtml(html)

      const ventajaElements = countElements(doc, ".ventaja-item")
      expect(ventajaElements).toBeGreaterThanOrEqual(3)
    })

    it("debe incluir títulos y descripciones para cada ventaja", () => {
      const html = generarVentajas(mockMarca)
      const doc = parseHtml(html)

      const h3Elements = countElements(doc, ".ventaja-item h3")
      const pElements = countElements(doc, ".ventaja-item p")

      expect(h3Elements).toBeGreaterThan(0)
      expect(pElements).toBeGreaterThan(0)
      expect(h3Elements).toBe(pElements)
    })
  })

  describe("generarDispositivosRelacionados", () => {
    it("debe generar HTML válido cuando hay dispositivos relacionados", () => {
      const html = generarDispositivosRelacionados(mockMarca, mockDispositivo, mockCiudad)

      if (html) {
        const validation = validateHtml(html)
        expect(validation.isValid).toBe(true)
      }
    })

    it("debe devolver cadena vacía cuando no hay dispositivos relacionados", () => {
      const marcaSinDispositivos: Marca = {
        ...mockMarca,
        dispositivos: [mockDispositivo], // Solo incluye el dispositivo actual
      }

      const html = generarDispositivosRelacionados(marcaSinDispositivos, mockDispositivo, mockCiudad)
      expect(html).toBe("")
    })

    it("debe incluir enlaces a otros dispositivos", () => {
      const html = generarDispositivosRelacionados(mockMarca, mockDispositivo, mockCiudad)

      if (html) {
        const doc = parseHtml(html)
        expect(elementExists(doc, "a")).toBe(true)
      }
    })
  })

  describe("generarMarcasRelacionadas", () => {
    it("debe generar HTML válido cuando hay marcas relacionadas", () => {
      const html = generarMarcasRelacionadas(mockMarca, mockDispositivo, mockCiudad, mockMarcas)

      if (html) {
        const validation = validateHtml(html)
        expect(validation.isValid).toBe(true)
      }
    })

    it("debe incluir enlaces a otras marcas", () => {
      const html = generarMarcasRelacionadas(mockMarca, mockDispositivo, mockCiudad, mockMarcas)

      if (html) {
        const doc = parseHtml(html)
        expect(elementExists(doc, "a")).toBe(true)
      }
    })
  })

  describe("generarInformacionAdicional", () => {
    it("debe generar HTML válido", () => {
      const html = generarInformacionAdicional(mockCiudad)
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir la información adicional de la ciudad", () => {
      const html = generarInformacionAdicional(mockCiudad)
      const doc = parseHtml(html)

      expect(doc.body.textContent).toContain(mockCiudad.informacion_adicional)
    })
  })

  describe("generarContacto", () => {
    it("debe generar HTML válido", () => {
      const html = generarContacto()
      const validation = validateHtml(html)

      expect(validation.isValid).toBe(true)
    })

    it("debe incluir un enlace telefónico", () => {
      const html = generarContacto()
      const doc = parseHtml(html)

      const telLink = doc.querySelector('a[href^="tel:"]')
      expect(telLink).not.toBeNull()
    })

    it("debe incluir información de horario", () => {
      const html = generarContacto()
      const doc = parseHtml(html)

      expect(elementExists(doc, ".contacto-horario")).toBe(true)
    })
  })

  describe("generarContenidoPagina", () => {
    it("debe generar un documento HTML completo y válido", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)

      // Verificar que es un documento HTML completo
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("<html")
      expect(html).toContain("<head>")
      expect(html).toContain("<body>")

      // Verificar que no hay elementos sin cerrar
      expect(hasUnclosedElements(html)).toBe(false)
    })

    it("debe incluir metadatos correctos", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)
      const doc = parseHtml(html)

      expect(elementExists(doc, "title")).toBe(true)
      expect(elementExists(doc, 'meta[name="description"]')).toBe(true)
      expect(elementExists(doc, 'meta[name="keywords"]')).toBe(true)
    })

    it("debe incluir todas las secciones principales", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)
      const doc = parseHtml(html)

      // Verificar que existe un h1
      expect(elementExists(doc, "h1")).toBe(true)

      // Verificar que hay múltiples secciones con h2
      expect(countElements(doc, "h2")).toBeGreaterThanOrEqual(3)

      // Verificar que existe la sección de contacto
      expect(elementExists(doc, ".contacto-seccion")).toBe(true)
    })

    it("debe incluir estilos CSS", () => {
      const html = generarContenidoPagina(mockMarca, mockDispositivo, mockCiudad, mockMarcas)
      const doc = parseHtml(html)

      expect(elementExists(doc, "style")).toBe(true)
    })
  })
})
