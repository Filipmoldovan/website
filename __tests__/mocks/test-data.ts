import type { Marca, Dispositivo } from "@/data/marcas-dispositivos"
import type { Ciudad } from "@/data/ciudades-zonas"

// Mock para una marca
export const mockMarca: Marca = {
  nombre: "TestMarca",
  slug: "test-marca",
  dispositivos: [
    {
      nombre: "Lavadora",
      slug: "lavadora",
      problemas_comunes: [
        "No desagua correctamente",
        "Ruidos extraños durante el centrifugado",
        "No calienta el agua",
        "Fugas de agua",
        "No completa el ciclo de lavado",
      ],
    },
    {
      nombre: "Frigorífico",
      slug: "frigorifico",
      problemas_comunes: [
        "No enfría correctamente",
        "Hace demasiado ruido",
        "Formación excesiva de hielo",
        "Fugas de agua",
        "La luz interior no funciona",
      ],
    },
  ],
}

// Mock para un dispositivo
export const mockDispositivo: Dispositivo = {
  nombre: "Lavadora",
  slug: "lavadora",
  problemas_comunes: [
    "No desagua correctamente",
    "Ruidos extraños durante el centrifugado",
    "No calienta el agua",
    "Fugas de agua",
    "No completa el ciclo de lavado",
  ],
}

// Mock para una ciudad
export const mockCiudad: Ciudad = {
  nombre: "TestCiudad",
  slug: "test-ciudad",
  zonas: ["Zona1", "Zona2", "Zona3", "Zona4"],
  servicios_disponibles: [
    "Reparación a domicilio",
    "Presupuesto sin compromiso",
    "Garantía de 3 meses",
    "Servicio urgente",
  ],
  problemas_comunes: ["Problema común 1", "Problema común 2", "Problema común 3"],
  informacion_adicional: "Información adicional de prueba para la ciudad.",
}

// Array de marcas para pruebas
export const mockMarcas: Marca[] = [
  mockMarca,
  {
    nombre: "OtraMarca",
    slug: "otra-marca",
    dispositivos: [
      {
        nombre: "Lavadora",
        slug: "lavadora",
        problemas_comunes: ["Problema específico 1", "Problema específico 2", "Problema específico 3"],
      },
    ],
  },
]
