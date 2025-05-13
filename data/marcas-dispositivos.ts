// Tipos para la estructura de datos
export interface Dispositivo {
  nombre: string
  slug: string
  problemas_comunes: string[]
}

export interface Marca {
  nombre: string
  slug: string
  dispositivos: Dispositivo[]
}

export interface CategoriaDispositivo {
  categoria: string
  marcas: Marca[]
}

// Problemas comunes por tipo de dispositivo
const problemasLavadoras = [
  "No desagua correctamente",
  "Ruidos extraños durante el centrifugado",
  "No calienta el agua",
  "Fugas de agua",
  "No completa el ciclo de lavado",
  "Error en el panel de control",
  "Vibraciones excesivas",
  "La puerta no se abre",
  "No enciende",
  "Manchas en la ropa",
]

const problemasLavavajillas = [
  "No desagua correctamente",
  "Vajilla no sale limpia",
  "Ruidos durante el funcionamiento",
  "Fugas de agua",
  "No dispensa detergente",
  "Error en el panel de control",
  "No calienta el agua",
  "Mal olor",
  "No completa el ciclo",
  "No enciende",
]

const problemasFrigorificos = [
  "No enfría correctamente",
  "Hace demasiado ruido",
  "Formación excesiva de hielo",
  "Fugas de agua",
  "La luz interior no funciona",
  "El motor funciona constantemente",
  "Temperatura irregular",
  "Alarma de temperatura",
  "Congelación de alimentos en el refrigerador",
  "Condensación excesiva",
]

const problemasHornos = [
  "No calienta correctamente",
  "La puerta no cierra bien",
  "El ventilador hace ruido",
  "La luz interior no funciona",
  "Error en el panel de control",
  "No mantiene la temperatura",
  "El grill no funciona",
  "Problemas con el temporizador",
  "No enciende",
  "Cocción desigual",
]

const problemasCocinas = [
  "Los quemadores no encienden",
  "Llama irregular",
  "Olor a gas",
  "Problemas con el encendido electrónico",
  "Temperatura irregular",
  "Perillas atascadas",
  "Superficie rayada",
  "Quemadores obstruidos",
  "No regula correctamente la llama",
  "Fugas de gas",
]

const problemasPlacas = [
  "No calienta correctamente",
  "Zonas que no funcionan",
  "Error en el panel táctil",
  "Se apaga sola",
  "Superficie rayada o dañada",
  "Indicadores luminosos defectuosos",
  "No reconoce los recipientes",
  "Calentamiento irregular",
  "Ruidos durante el funcionamiento",
  "No enciende",
]

const problemasCampanas = [
  "Poca potencia de extracción",
  "Ruido excesivo",
  "Las luces no funcionan",
  "Vibración durante el funcionamiento",
  "Botones que no responden",
  "Filtros obstruidos",
  "Motor defectuoso",
  "No enciende",
  "Olor persistente a pesar de estar encendida",
  "Condensación excesiva",
]

const problemasCongeladores = [
  "No congela correctamente",
  "Formación excesiva de hielo",
  "Ruido anormal",
  "La puerta no cierra bien",
  "Temperatura irregular",
  "Alarma de temperatura",
  "Consumo excesivo de energía",
  "Descongelación frecuente",
  "No enciende",
  "Fugas de agua",
]

const problemasSecadoras = [
  "No seca la ropa completamente",
  "Ruidos extraños durante el funcionamiento",
  "Calentamiento excesivo",
  "No gira el tambor",
  "Error en el panel de control",
  "La puerta no cierra bien",
  "Tiempo de secado muy largo",
  "No enciende",
  "Olor a quemado",
  "Pelusa excesiva",
]

const problemasCalderas = [
  "No calienta el agua",
  "Pierde presión",
  "Ruidos extraños",
  "Fugas de agua",
  "Error en el panel de control",
  "Se apaga sola",
  "No enciende",
  "Radiadores no calientan uniformemente",
  "Consumo excesivo de gas",
  "Bloqueo por falta de mantenimiento",
]

const problemasCalentadores = [
  "No calienta el agua",
  "Temperatura irregular",
  "Se apaga durante el uso",
  "Fugas de agua",
  "Llama inestable",
  "Olor a gas",
  "No enciende",
  "Ruidos extraños",
  "Piloto que se apaga",
  "Baja presión de agua caliente",
]

const problemasTermos = [
  "No calienta el agua",
  "Fugas de agua",
  "Temperatura irregular",
  "Ruidos extraños",
  "Disyuntor que salta",
  "Tiempo de calentamiento excesivo",
  "Agua demasiado caliente",
  "No mantiene la temperatura",
  "Corrosión visible",
  "Consumo eléctrico excesivo",
]

const problemasAireAcondicionado = [
  "No enfría correctamente",
  "Goteo de agua",
  "Ruidos extraños",
  "Mal olor",
  "Error en el panel de control",
  "No enciende",
  "El ventilador no funciona",
  "Formación de hielo en la unidad exterior",
  "El mando a distancia no funciona",
  "Consumo eléctrico excesivo",
]

// Función para crear dispositivos con sus problemas comunes
function crearDispositivo(nombre: string, problemas: string[]): Dispositivo {
  return {
    nombre,
    slug: nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-"),
    problemas_comunes: problemas,
  }
}

// Crear dispositivos comunes
const lavadoras = crearDispositivo("Lavadoras", problemasLavadoras)
const lavavajillas = crearDispositivo("Lavavajillas", problemasLavavajillas)
const frigorificos = crearDispositivo("Frigoríficos", problemasFrigorificos)
const hornos = crearDispositivo("Hornos", problemasHornos)
const cocinas = crearDispositivo("Cocinas", problemasCocinas)
const placasInduccion = crearDispositivo("Placas de Inducción", problemasPlacas)
const campanasExtractoras = crearDispositivo("Campanas Extractoras", problemasCampanas)
const congeladores = crearDispositivo("Congeladores", problemasCongeladores)
const secadoras = crearDispositivo("Secadoras", problemasSecadoras)
const calderas = crearDispositivo("Calderas", problemasCalderas)
const calentadores = crearDispositivo("Calentadores", problemasCalentadores)
const termosElectricos = crearDispositivo("Termos eléctricos", problemasTermos)
const aireAcondicionado = crearDispositivo("Aire acondicionado", problemasAireAcondicionado)

// Función para crear marcas con sus dispositivos
function crearMarca(nombre: string, dispositivos: Dispositivo[]): Marca {
  return {
    nombre,
    slug: nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-"),
    dispositivos,
  }
}

// Electrodomésticos
export const electrodomesticos: CategoriaDispositivo = {
  categoria: "Electrodomésticos",
  marcas: [
    crearMarca("Bosch", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Siemens", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Balay", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("AEG", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Electrolux", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Zanussi", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Whirlpool", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Candy", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Hoover", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Samsung", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("LG", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Beko", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Haier", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Hisense", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Indesit", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Teka", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Miele", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Liebherr", [frigorificos, congeladores]),
    crearMarca("Smeg", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Corberó", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Edesa", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Aspes", [lavadoras, lavavajillas, frigorificos, hornos, cocinas, congeladores, secadoras]),
    crearMarca("Neff", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Amica", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
    ]),
    crearMarca("Sharp", [lavadoras, lavavajillas, frigorificos, hornos, cocinas, congeladores, secadoras]),
    crearMarca("Grundig", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
    crearMarca("Cata", [hornos, cocinas, placasInduccion, campanasExtractoras]),
    crearMarca("Orbegozo", [hornos, cocinas, placasInduccion, campanasExtractoras, congeladores]),
    crearMarca("Rommer", [lavadoras, lavavajillas, frigorificos, hornos, congeladores, secadoras]),
    crearMarca("Sauber", [lavadoras, lavavajillas, frigorificos, congeladores, secadoras]),
    crearMarca("White Westinghouse", [lavadoras, frigorificos, congeladores, secadoras]),
    crearMarca("Schneider", [lavadoras, frigorificos, hornos, cocinas, congeladores, secadoras]),
    crearMarca("Kunft", [lavadoras, frigorificos, congeladores]),
    crearMarca("Otsein", [lavadoras, lavavajillas, secadoras]),
    crearMarca("Fagor", [
      lavadoras,
      lavavajillas,
      frigorificos,
      hornos,
      cocinas,
      placasInduccion,
      campanasExtractoras,
      congeladores,
      secadoras,
    ]),
  ],
}

// Calefacción
export const calefaccion: CategoriaDispositivo = {
  categoria: "Calefacción",
  marcas: [
    crearMarca("Junkers", [calderas, calentadores, termosElectricos]),
    crearMarca("Vaillant", [calderas, calentadores, termosElectricos]),
    crearMarca("Saunier Duval", [calderas, calentadores, termosElectricos]),
    crearMarca("Cointra", [calderas, calentadores, termosElectricos]),
    crearMarca("Ariston", [calderas, calentadores, termosElectricos]),
    crearMarca("Ferroli", [calderas, calentadores, termosElectricos]),
    crearMarca("Baxi", [calderas, calentadores, termosElectricos]),
    crearMarca("Beretta", [calderas, calentadores, termosElectricos]),
    crearMarca("Immergas", [calderas, calentadores, termosElectricos]),
    crearMarca("Chaffoteaux", [calderas, calentadores, termosElectricos]),
    crearMarca("Wolf", [calderas, calentadores, termosElectricos]),
    crearMarca("Domusa Teknik", [calderas, calentadores, termosElectricos]),
    crearMarca("Viessmann", [calderas, calentadores, termosElectricos]),
    crearMarca("Thermor", [calderas, calentadores, termosElectricos]),
    crearMarca("Fagor", [calderas, calentadores, termosElectricos]),
    crearMarca("Corberó", [termosElectricos, calentadores]),
    crearMarca("Edesa", [termosElectricos, calentadores]),
    crearMarca("Aspes", [termosElectricos, calentadores]),
    crearMarca("Teka", [termosElectricos, calentadores]),
    crearMarca("Fleck", [termosElectricos, calentadores]),
    crearMarca("Cabel", [calderas, calentadores, termosElectricos]),
    crearMarca("ACV", [calderas, termosElectricos]),
    crearMarca("Atlantic", [termosElectricos, calentadores]),
    crearMarca("Bosch", [calderas, calentadores, termosElectricos]),
    crearMarca("HTW", [termosElectricos]),
    crearMarca("Giacomini", [calderas]),
    crearMarca("De Dietrich", [calderas, calentadores, termosElectricos]),
    crearMarca("Manaut", [calderas, calentadores]),
    crearMarca("Elco", [calderas]),
    crearMarca("Hermann", [calderas, calentadores, termosElectricos]),
    crearMarca("Tesy", [termosElectricos]),
    crearMarca("Biasi", [calderas, calentadores]),
    crearMarca("Stiebel Eltron", [termosElectricos, calentadores]),
    crearMarca("Idrogas", [calderas, calentadores]),
    crearMarca("Panasonic", [calderas]),
  ],
}

// Aire acondicionado
export const aireAcondicionados: CategoriaDispositivo = {
  categoria: "Aire Acondicionado",
  marcas: [
    crearMarca("Daikin", [aireAcondicionado]),
    crearMarca("Mitsubishi Electric", [aireAcondicionado]),
    crearMarca("Fujitsu", [aireAcondicionado]),
    crearMarca("Panasonic", [aireAcondicionado]),
    crearMarca("LG", [aireAcondicionado]),
    crearMarca("Samsung", [aireAcondicionado]),
    crearMarca("Haier", [aireAcondicionado]),
    crearMarca("Hisense", [aireAcondicionado]),
    crearMarca("Carrier", [aireAcondicionado]),
    crearMarca("Toshiba", [aireAcondicionado]),
    crearMarca("Hitachi", [aireAcondicionado]),
    crearMarca("General Electric", [aireAcondicionado]),
    crearMarca("Baxi", [aireAcondicionado]),
    crearMarca("Vaillant", [aireAcondicionado]),
    crearMarca("Saunier Duval", [aireAcondicionado]),
    crearMarca("Johnson", [aireAcondicionado]),
    crearMarca("Junkers", [aireAcondicionado]),
    crearMarca("Daitsu", [aireAcondicionado]),
    crearMarca("Gree", [aireAcondicionado]),
    crearMarca("Midea", [aireAcondicionado]),
    crearMarca("Mundoclima", [aireAcondicionado]),
    crearMarca("Whirlpool", [aireAcondicionado]),
    crearMarca("Electrolux", [aireAcondicionado]),
    crearMarca("Orbegozo", [aireAcondicionado]),
    crearMarca("Zanussi", [aireAcondicionado]),
    crearMarca("Ferroli", [aireAcondicionado]),
    crearMarca("Corberó", [aireAcondicionado]),
    crearMarca("Kosner", [aireAcondicionado]),
    crearMarca("HTW", [aireAcondicionado]),
    crearMarca("Ariston", [aireAcondicionado]),
    crearMarca("Sharp", [aireAcondicionado]),
    crearMarca("EAS Electric", [aireAcondicionado]),
    crearMarca("Equation", [aireAcondicionado]),
    crearMarca("Giatsu", [aireAcondicionado]),
    crearMarca("Olimpia Splendid", [aireAcondicionado]),
  ],
}

// Exportar todas las categorías
export const todasLasCategorias = [electrodomesticos, calefaccion, aireAcondicionados]

// Función para obtener todas las marcas
export function obtenerTodasLasMarcas(): Marca[] {
  const todasLasMarcas: Marca[] = []

  todasLasCategorias.forEach((categoria) => {
    categoria.marcas.forEach((marca) => {
      // Verificar si la marca ya existe en el array
      const marcaExistente = todasLasMarcas.find((m) => m.nombre === marca.nombre)

      if (marcaExistente) {
        // Combinar dispositivos sin duplicados
        marca.dispositivos.forEach((dispositivo) => {
          if (!marcaExistente.dispositivos.some((d) => d.nombre === dispositivo.nombre)) {
            marcaExistente.dispositivos.push(dispositivo)
          }
        })
      } else {
        // Añadir la marca si no existe
        todasLasMarcas.push({ ...marca })
      }
    })
  })

  return todasLasMarcas
}

// Exportar todas las marcas
export const todasLasMarcas = obtenerTodasLasMarcas()
