import { validateAndFixHtml } from "@/lib/html-validator"

describe("HTML Validator", () => {
  describe("validateAndFixHtml", () => {
    it("debe validar HTML correcto sin errores", () => {
      const html = `
        <div>
          <h1>Título</h1>
          <p>Párrafo de texto</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `

      const result = validateAndFixHtml(html)
      expect(result.originalValidation.isValid).toBe(true)
      expect(result.originalValidation.errors.length).toBe(0)
    })

    it("debe detectar anidamiento inválido de elementos de bloque dentro de párrafos", () => {
      const html = `
        <div>
          <p>
            Texto
            <div>Esto no debería estar aquí</div>
            Más texto
          </p>
        </div>
      `

      const result = validateAndFixHtml(html)
      expect(result.originalValidation.isValid).toBe(false)
    })

    it("debe detectar listas dentro de párrafos", () => {
      const html = `
        <div>
          <p>
            Texto
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </p>
        </div>
      `

      const result = validateAndFixHtml(html)
      expect(result.originalValidation.isValid).toBe(false)
    })

    it("debe corregir anidamiento inválido", () => {
      const html = `
        <div>
          <p>
            Texto
            <div>Esto no debería estar aquí</div>
            Más texto
          </p>
        </div>
      `

      const result = validateAndFixHtml(html)
      expect(result.fixedValidation.isValid).toBe(true)
      expect(result.fixedHtml).not.toEqual(html)
    })

    it("debe manejar HTML malformado sin errores", () => {
      const html = `
        <div>
          <h1>Título sin cerrar
          <p>Párrafo sin cerrar
          <ul>
            <li>Item 1
            <li>Item 2
          </div>
      `

      // No debería lanzar excepciones
      expect(() => validateAndFixHtml(html)).not.toThrow()

      const result = validateAndFixHtml(html)
      expect(result.originalValidation.isValid).toBe(false)
      expect(result.fixedHtml).not.toEqual(html)
    })
  })
})
