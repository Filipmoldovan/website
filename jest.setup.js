// Configuración global para pruebas
import "@testing-library/jest-dom"

// Silenciar advertencias de consola durante las pruebas
global.console = {
  ...console,
  // Descomenta para silenciar mensajes específicos
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
