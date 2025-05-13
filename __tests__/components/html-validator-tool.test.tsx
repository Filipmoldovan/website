import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { HtmlValidatorTool } from "@/components/html-validator-tool"
import * as validator from "@/lib/html-validator"

// Mock del validador HTML
jest.mock("@/lib/html-validator", () => ({
  validateAndFixHtml: jest.fn(),
}))

describe("HtmlValidatorTool", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar correctamente", () => {
    render(<HtmlValidatorTool />)

    expect(screen.getByText("Validador de HTML")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Pega tu HTML aquí para validarlo...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /validar html/i })).toBeInTheDocument()
  })

  it("debe mostrar mensaje de éxito cuando el HTML es válido", async () => {
    // Configurar el mock para devolver HTML válido
    ;(validator.validateAndFixHtml as jest.Mock).mockReturnValue({
      originalValidation: { isValid: true, errors: [] },
      fixedHtml: "<div>HTML válido</div>",
      fixedValidation: { isValid: true, errors: [] },
    })

    render(<HtmlValidatorTool />)

    // Ingresar HTML y hacer clic en validar
    const textarea = screen.getByPlaceholderText("Pega tu HTML aquí para validarlo...")
    fireEvent.change(textarea, { target: { value: "<div>HTML válido</div>" } })

    const validateButton = screen.getByRole("button", { name: /validar html/i })
    fireEvent.click(validateButton)

    // Verificar que se muestra el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText("HTML Válido")).toBeInTheDocument()
      expect(screen.getByText("No se encontraron problemas en la estructura HTML.")).toBeInTheDocument()
    })
  })

  it("debe mostrar errores cuando el HTML es inválido", async () => {
    // Configurar el mock para devolver HTML inválido
    ;(validator.validateAndFixHtml as jest.Mock).mockReturnValue({
      originalValidation: {
        isValid: false,
        errors: ["Error 1: Elemento inválido", "Error 2: Anidamiento incorrecto"],
      },
      fixedHtml: "<div>HTML corregido</div>",
      fixedValidation: { isValid: true, errors: [] },
    })

    render(<HtmlValidatorTool />)

    // Ingresar HTML y hacer clic en validar
    const textarea = screen.getByPlaceholderText("Pega tu HTML aquí para validarlo...")
    fireEvent.change(textarea, { target: { value: "<p><div>HTML inválido</div></p>" } })

    const validateButton = screen.getByRole("button", { name: /validar html/i })
    fireEvent.click(validateButton)

    // Verificar que se muestran los errores
    await waitFor(() => {
      expect(screen.getByText("Problemas Detectados")).toBeInTheDocument()
      expect(screen.getByText("Error 1: Elemento inválido")).toBeInTheDocument()
      expect(screen.getByText("Error 2: Anidamiento incorrecto")).toBeInTheDocument()
    })

    // Verificar que se muestra el HTML corregido
    expect(screen.getByText("HTML Corregido:")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /aplicar corrección/i })).toBeInTheDocument()
  })

  it("debe aplicar la corrección cuando se hace clic en el botón", async () => {
    // Configurar el mock para devolver HTML inválido y luego válido
    ;(validator.validateAndFixHtml as jest.Mock)
      .mockReturnValueOnce({
        originalValidation: {
          isValid: false,
          errors: ["Error: Anidamiento incorrecto"],
        },
        fixedHtml: "<div>HTML corregido</div>",
        fixedValidation: { isValid: true, errors: [] },
      })
      .mockReturnValueOnce({
        originalValidation: { isValid: true, errors: [] },
        fixedHtml: "<div>HTML corregido</div>",
        fixedValidation: { isValid: true, errors: [] },
      })

    render(<HtmlValidatorTool />)

    // Ingresar HTML y hacer clic en validar
    const textarea = screen.getByPlaceholderText("Pega tu HTML aquí para validarlo...")
    fireEvent.change(textarea, { target: { value: "<p><div>HTML inválido</div></p>" } })

    const validateButton = screen.getByRole("button", { name: /validar html/i })
    fireEvent.click(validateButton)

    // Verificar que se muestra el botón de aplicar corrección
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /aplicar corrección/i })).toBeInTheDocument()
    })

    // Hacer clic en aplicar corrección
    const applyButton = screen.getByRole("button", { name: /aplicar corrección/i })
    fireEvent.click(applyButton)

    // Verificar que se actualiza el textarea y se muestra el mensaje de éxito
    await waitFor(() => {
      expect(textarea).toHaveValue("<div>HTML corregido</div>")
      expect(screen.getByText("HTML Válido")).toBeInTheDocument()
    })
  })
})
