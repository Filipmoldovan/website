import {
  ciudades,
  electrodomesticos,
  ventajasCompetitivas,
  procesoReparacion,
  consejosPracticos,
  garantias,
  llamadasAccion,
  titulos,
  metaDescripciones,
  introducciones,
} from "@/data/constants"

// Función para mezclar un array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Función para seleccionar elementos aleatorios de un array
function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count)
}

// Función para seleccionar un elemento aleatorio de un array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Función para reemplazar marcadores en un texto
function replaceMarkers(text: string, marca: string, ciudad: string): string {
  return text.replace(/\[MARCA\]/g, marca).replace(/\[CIUDAD\]/g, ciudad)
}

// Función para generar un título SEO
function generateTitle(marca: string, ciudad: string): string {
  const titulo = getRandomItem(titulos)
  return replaceMarkers(titulo, marca, ciudad)
}

// Función para generar una meta descripción
function generateMetaDescription(marca: string, ciudad: string): string {
  const metaDescripcion = getRandomItem(metaDescripciones)
  return replaceMarkers(metaDescripcion, marca, ciudad)
}

// Función para generar la introducción
function generateIntroduction(marca: string, ciudad: string): string {
  const introduccion = getRandomItem(introducciones)
  return replaceMarkers(introduccion, marca, ciudad)
}

// Función para generar la lista de electrodomésticos con enlaces SEO
function generateAppliancesList(marca: string, ciudad: string): string {
  const electrodomesticosShuffled = shuffleArray(electrodomesticos).slice(0, 8)

  let html = `<h2>Electrodomésticos ${marca} que reparamos en ${ciudad}</h2>`
  html += '<ul class="appliances-list">'

  electrodomesticosShuffled.forEach((electrodomestico) => {
    const slug = electrodomestico
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
    const marcaSlug = marca.toLowerCase().replace(/\s+/g, "-")
    const ciudadSlug = ciudad.toLowerCase().replace(/\s+/g, "-")

    html += `<li><a href="reparacion-de-${slug}-${marcaSlug}-en-${ciudadSlug}.html">Reparación de ${electrodomestico} ${marca} en ${ciudad}</a></li>`
  })

  html += "</ul>"
  return html
}

// Función para generar la lista de barrios
function generateNeighborhoodsList(ciudad: string): string {
  const ciudadInfo = ciudades.find((c) => c.nombre === ciudad)
  if (!ciudadInfo) return ""

  const barriosShuffled = shuffleArray([...ciudadInfo.barrios])

  let html = `<h2>Zonas de servicio en ${ciudad}</h2>`
  html += "<p>Nuestro servicio técnico cubre todas las zonas y barrios de " + ciudad + ":</p>"
  html += '<ul class="neighborhoods-list">'

  barriosShuffled.forEach((barrio) => {
    html += `<li>${barrio}</li>`
  })

  html += "</ul>"
  return html
}

// Función para generar las ventajas competitivas
function generateCompetitiveAdvantages(marca: string): string {
  const ventajasShuffled = shuffleArray([...ventajasCompetitivas])

  let html = "<h2>Ventajas de nuestro servicio técnico especializado</h2>"
  html += '<div class="advantages">'

  ventajasShuffled.forEach((ventaja) => {
    const descripcionPersonalizada = replaceMarkers(ventaja.descripcion, marca, "")
    html += `
      <div class="advantage-item">
        <h3>${ventaja.titulo}</h3>
        <p>${descripcionPersonalizada}</p>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar el proceso de reparación
function generateRepairProcess(marca: string): string {
  const procesosShuffled = shuffleArray([...procesoReparacion])

  let html = "<h2>Nuestro proceso de reparación profesional</h2>"
  html += '<div class="repair-process">'

  procesosShuffled.forEach((proceso, index) => {
    const descripcionPersonalizada = replaceMarkers(proceso.descripcion, marca, "")
    html += `
      <div class="process-step">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          <h3>${proceso.paso}</h3>
          <p>${descripcionPersonalizada}</p>
        </div>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar consejos prácticos
function generatePracticalTips(marca: string): string {
  const consejosShuffled = getRandomItems(consejosPracticos, 3)

  let html = "<h2>Consejos prácticos para el mantenimiento de sus electrodomésticos</h2>"
  html += '<div class="practical-tips">'

  consejosShuffled.forEach((consejo) => {
    const descripcionPersonalizada = replaceMarkers(consejo.descripcion, marca, "")
    html += `
      <div class="tip-item">
        <h3>${consejo.titulo}</h3>
        <p>${descripcionPersonalizada}</p>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar garantías y compromiso
function generateWarranty(marca: string, ciudad: string): string {
  const garantiasShuffled = getRandomItems(garantias, 3)

  let html = "<h2>Nuestra garantía y compromiso profesional</h2>"
  html += '<div class="warranty-section">'

  garantiasShuffled.forEach((garantia) => {
    const descripcionPersonalizada = replaceMarkers(garantia.descripcion, marca, ciudad)

    html += `
      <div class="warranty-item">
        <h3>${garantia.titulo}</h3>
        <p>${descripcionPersonalizada}</p>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar llamada a la acción
function generateCallToAction(marca: string, ciudad: string): string {
  const llamadaRandom = getRandomItem(llamadasAccion)

  const tituloPersonalizado = replaceMarkers(llamadaRandom.titulo, marca, ciudad)
  const descripcionPersonalizada = replaceMarkers(llamadaRandom.descripcion, marca, ciudad)

  const html = `
    <div class="call-to-action">
      <h2>${tituloPersonalizado}</h2>
      <p>${descripcionPersonalizada}</p>
      <div class="contact-button">
        <a href="tel:${llamadaRandom.telefono}" class="phone-button">
          <span class="phone-icon">📞</span>
          <span class="phone-number">${llamadaRandom.telefono}</span>
        </a>
      </div>
    </div>
  `

  return html
}

// Función para generar el artículo completo
export function generateArticle(marca: string, ciudad: string): string {
  const title = generateTitle(marca, ciudad)
  const metaDescription = generateMetaDescription(marca, ciudad)

  // Crear un array con todas las secciones para poder mezclarlas
  const sections = [
    generateIntroduction(marca, ciudad),
    generateAppliancesList(marca, ciudad),
    generateNeighborhoodsList(ciudad),
    generateCompetitiveAdvantages(marca),
    generateRepairProcess(marca),
    generatePracticalTips(marca),
    generateWarranty(marca, ciudad),
  ]

  // Mezclar las secciones para tener un orden diferente cada vez
  const shuffledSections = shuffleArray(sections)

  // La llamada a la acción siempre va al final
  shuffledSections.push(generateCallToAction(marca, ciudad))

  // Construir el HTML completo
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="servicio técnico ${marca}, reparación ${marca} ${ciudad}, electrodomésticos ${marca}, técnicos especializados ${marca}, reparación urgente ${marca}">
  <meta name="author" content="Servicio Técnico Electrodomésticos">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1a5276;
      text-align: center;
      margin-bottom: 30px;
    }
    h2 {
      color: #2874a6;
      margin-top: 40px;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    h3 {
      color: #3498db;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    ul.appliances-list li, ul.neighborhoods-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    ul.appliances-list li:last-child, ul.neighborhoods-list li:last-child {
      border-bottom: none;
    }
    a {
      color: #2874a6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .advantages, .practical-tips, .warranty-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .advantage-item, .tip-item, .warranty-item {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .repair-process {
      margin-top: 20px;
    }
    .process-step {
      display: flex;
      margin-bottom: 20px;
      align-items: flex-start;
    }
    .step-number {
      background-color: #2874a6;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .step-content {
      flex-grow: 1;
    }
    .call-to-action {
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-top: 40px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .contact-button {
      margin-top: 20px;
    }
    .phone-button {
      display: inline-flex;
      align-items: center;
      background-color: #2874a6;
      color: white;
      padding: 12px 25px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      transition: background-color 0.3s;
    }
    .phone-button:hover {
      background-color: #1a5276;
      text-decoration: none;
    }
    .phone-icon {
      margin-right: 10px;
    }
    @media (max-width: 768px) {
      .advantages, .practical-tips, .warranty-section {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${shuffledSections.join("\n")}
</body>
</html>
  `

  return htmlContent
}
