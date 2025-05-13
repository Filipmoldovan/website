import type { Ciudad } from "@/data/ciudades-zonas"
import type { Marca, Dispositivo } from "@/data/marcas-dispositivos"

// Función para generar un título único para cada página
export function generarTitulo(marca: Marca, dispositivo: Dispositivo, ciudad: Ciudad): string {
  const titulos = [
    `Reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} - Servicio Especializado`,
    `Servicio Técnico de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} - Reparación Garantizada`,
    `Reparamos tu ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} - Técnicos Especializados`,
    `Especialistas en ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} - Servicio Rápido`,
    `Reparación Profesional de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre}`,
  ]

  // Seleccionar un título aleatorio
  return titulos[Math.floor(Math.random() * titulos.length)]
}

// Función para generar una meta descripción única
export function generarMetaDescripcion(marca: Marca, dispositivo: Dispositivo, ciudad: Ciudad): string {
  const descripciones = [
    `Servicio técnico especializado en reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre}. Técnicos cualificados, piezas originales y garantía de 3 meses en todas las reparaciones.`,
    `Reparación profesional de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre}. Diagnóstico preciso, presupuesto sin compromiso y garantía de 3 meses en nuestro trabajo.`,
    `Expertos en reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} y alrededores. Servicio rápido a domicilio con 3 meses de garantía en todas nuestras intervenciones.`,
    `¿Problemas con tu ${dispositivo.nombre} ${marca.nombre}? Nuestros técnicos especializados en ${ciudad.nombre} te ofrecen un servicio de calidad con 3 meses de garantía.`,
    `Reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre} con técnicos especializados. Presupuesto sin compromiso y 3 meses de garantía en todas las reparaciones.`,
  ]

  // Seleccionar una descripción aleatoria
  return descripciones[Math.floor(Math.random() * descripciones.length)]
}

// Función para generar una introducción única
export function generarIntroduccion(marca: Marca, dispositivo: Dispositivo, ciudad: Ciudad): string {
  const introducciones = [
    `<p>Bienvenido a nuestro servicio técnico especializado en <strong>${dispositivo.nombre} ${marca.nombre}</strong> en <strong>${ciudad.nombre}</strong>. Contamos con técnicos altamente cualificados y con amplia experiencia en la reparación de estos equipos. Utilizamos herramientas específicas y piezas originales para garantizar la calidad de nuestras reparaciones, ofreciendo siempre un servicio profesional y eficiente.</p>`,

    `<p>En nuestro servicio de reparación de <strong>${dispositivo.nombre} ${marca.nombre}</strong> en <strong>${ciudad.nombre}</strong>, nos especializamos en solucionar todo tipo de averías con rapidez y eficacia. Nuestro equipo de técnicos cuenta con formación específica en esta marca y tipo de electrodoméstico, lo que nos permite ofrecer un diagnóstico preciso y soluciones duraderas para cualquier problema que pueda presentar su equipo.</p>`,

    `<p>Si su <strong>${dispositivo.nombre} ${marca.nombre}</strong> presenta algún problema en <strong>${ciudad.nombre}</strong>, nuestro equipo de profesionales está a su disposición para ofrecerle el mejor servicio de reparación. Nos caracterizamos por nuestra rapidez, profesionalidad y compromiso con la satisfacción del cliente, asegurando intervenciones de calidad con 3 meses de garantía en todas nuestras reparaciones.</p>`,

    `<p>Somos especialistas en la reparación de <strong>${dispositivo.nombre} ${marca.nombre}</strong> en <strong>${ciudad.nombre}</strong> y alrededores. Nuestros técnicos cuentan con amplia experiencia en la resolución de todo tipo de averías en estos equipos, utilizando siempre piezas originales y ofreciendo un servicio rápido y eficiente a precios competitivos.</p>`,

    `<p>¿Su <strong>${dispositivo.nombre} ${marca.nombre}</strong> no funciona correctamente en <strong>${ciudad.nombre}</strong>? Nuestro servicio técnico especializado cuenta con profesionales expertos en la reparación de estos equipos. Ofrecemos diagnósticos precisos, presupuestos transparentes y reparaciones garantizadas para devolverle la tranquilidad y el buen funcionamiento de su electrodoméstico.</p>`,
  ]

  // Seleccionar una introducción aleatoria
  return introducciones[Math.floor(Math.random() * introducciones.length)]
}

// Función para generar la sección de problemas comunes
export function generarProblemasComunes(dispositivo: Dispositivo): string {
  let html = `<h2>Problemas comunes en ${dispositivo.nombre}</h2>`
  html += '<div class="problemas-comunes">'
  html += "<p>Estos son algunos de los problemas más frecuentes que solucionamos:</p>"
  html += "<ul>"

  // Seleccionar 5 problemas aleatorios sin repetir
  const problemasSeleccionados = [...dispositivo.problemas_comunes].sort(() => 0.5 - Math.random()).slice(0, 5)

  problemasSeleccionados.forEach((problema) => {
    html += `<li><strong>${problema}</strong>: Contamos con la experiencia y herramientas necesarias para solucionar este problema de forma eficiente.</li>`
  })

  html += "</ul>"
  html += "</div>"

  return html
}

// Función para generar la sección de zonas de servicio
export function generarZonasServicio(ciudad: Ciudad): string {
  let html = `<h2>Zonas de servicio en ${ciudad.nombre}</h2>`
  html += `<p>Nuestro servicio técnico cubre todas las zonas y barrios de ${ciudad.nombre}:</p>`
  html += '<div class="zonas-grid">'

  ciudad.zonas.forEach((zona) => {
    html += `<div class="zona-item">${zona}</div>`
  })

  html += "</div>"

  return html
}

// Función para generar la sección de servicios disponibles
export function generarServiciosDisponibles(ciudad: Ciudad): string {
  let html = `<h2>Servicios disponibles en ${ciudad.nombre}</h2>`
  html += '<div class="servicios-disponibles">'

  ciudad.servicios_disponibles.forEach((servicio) => {
    html += `<div class="servicio-item">
      <div class="servicio-icono">✓</div>
      <div class="servicio-texto">${servicio}</div>
    </div>`
  })

  html += "</div>"

  return html
}

// Función para generar la sección de proceso de reparación
export function generarProcesoReparacion(): string {
  const procesos = [
    {
      paso: "Diagnóstico inicial",
      descripcion:
        "Realizamos un análisis exhaustivo para identificar con precisión el origen de la avería en su electrodoméstico. Utilizamos herramientas de diagnóstico avanzadas que nos permiten detectar incluso los problemas más complejos.",
    },
    {
      paso: "Presupuesto detallado",
      descripcion:
        "Le presentamos un presupuesto claro y transparente, explicándole todas las opciones disponibles para que pueda tomar la mejor decisión. Este presupuesto incluye el desglose completo de piezas y mano de obra sin costes ocultos.",
    },
    {
      paso: "Reparación profesional",
      descripcion:
        "Utilizamos herramientas especializadas y repuestos de calidad para garantizar una reparación duradera y eficiente. Nuestros técnicos siguen protocolos específicos establecidos para cada tipo de electrodoméstico.",
    },
    {
      paso: "Verificación completa",
      descripcion:
        "Realizamos pruebas exhaustivas para comprobar que su electrodoméstico funciona perfectamente antes de dar por finalizado el servicio. Esto incluye ciclos de prueba completos y verificación de todos los sistemas y componentes.",
    },
    {
      paso: "Garantía de 3 meses",
      descripcion:
        "Todas nuestras reparaciones incluyen 3 meses de garantía por escrito que cubre tanto la mano de obra como las piezas utilizadas. Esta garantía le protege ante cualquier defecto en la reparación realizada.",
    },
  ]

  let html = "<h2>Nuestro proceso de reparación profesional</h2>"
  html += '<div class="proceso-reparacion">'

  procesos.forEach((proceso, index) => {
    html += `
      <div class="proceso-paso">
        <div class="paso-numero">${index + 1}</div>
        <div class="paso-contenido">
          <h3>${proceso.paso}</h3>
          <p>${proceso.descripcion}</p>
        </div>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar la sección de ventajas
export function generarVentajas(marca: Marca): string {
  const ventajas = [
    {
      titulo: "Técnicos especializados",
      descripcion: `Nuestro equipo está formado por profesionales con amplia experiencia en la reparación de electrodomésticos ${marca.nombre}, con formación continua en las últimas tecnologías y modelos.`,
    },
    {
      titulo: "Rapidez y eficiencia",
      descripcion:
        "Nuestros técnicos llegan a su domicilio en el menor tiempo posible, resolviendo la mayoría de averías en la primera visita para minimizar las molestias.",
    },
    {
      titulo: "Piezas de calidad",
      descripcion: `Utilizamos repuestos de alta calidad compatibles con su electrodoméstico ${marca.nombre}, garantizando la durabilidad y el rendimiento óptimo tras la reparación.`,
    },
    {
      titulo: "Presupuestos transparentes",
      descripcion:
        "Antes de iniciar cualquier reparación, le ofrecemos un presupuesto detallado y sin compromiso, sin costes ocultos ni cargos adicionales.",
    },
    {
      titulo: "Garantía de 3 meses",
      descripcion:
        "Todas nuestras reparaciones incluyen 3 meses de garantía por escrito en mano de obra y repuestos utilizados, para su total tranquilidad.",
    },
  ]

  let html = "<h2>Ventajas de nuestro servicio técnico especializado</h2>"
  html += '<div class="ventajas-grid">'

  ventajas.forEach((ventaja) => {
    html += `
      <div class="ventaja-item">
        <h3>${ventaja.titulo}</h3>
        <p>${ventaja.descripcion}</p>
      </div>
    `
  })

  html += "</div>"
  return html
}

// Función para generar la sección de dispositivos relacionados
export function generarDispositivosRelacionados(marca: Marca, dispositivoActual: Dispositivo, ciudad: Ciudad): string {
  // Filtrar el dispositivo actual
  const dispositivosRelacionados = marca.dispositivos.filter((d) => d.nombre !== dispositivoActual.nombre)

  // Si no hay dispositivos relacionados, devolver cadena vacía
  if (dispositivosRelacionados.length === 0) return ""

  // Seleccionar hasta 4 dispositivos aleatorios
  const dispositivosSeleccionados = dispositivosRelacionados.sort(() => 0.5 - Math.random()).slice(0, 4)

  let html = `<h2>Otros electrodomésticos ${marca.nombre} que reparamos en ${ciudad.nombre}</h2>`
  html += '<ul class="dispositivos-relacionados">'

  dispositivosSeleccionados.forEach((dispositivo) => {
    const url = `/reparacion-${dispositivo.slug}-${marca.slug}-${ciudad.slug}.html`
    html += `<li><a href="${url}">Reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre}</a></li>`
  })

  html += "</ul>"

  return html
}

// Función para generar la sección de marcas relacionadas
export function generarMarcasRelacionadas(
  marcaActual: Marca,
  dispositivo: Dispositivo,
  ciudad: Ciudad,
  todasLasMarcas: Marca[],
): string {
  // Encontrar otras marcas que tengan el mismo tipo de dispositivo
  const marcasRelacionadas = todasLasMarcas.filter(
    (marca) => marca.nombre !== marcaActual.nombre && marca.dispositivos.some((d) => d.nombre === dispositivo.nombre),
  )

  // Si no hay marcas relacionadas, devolver cadena vacía
  if (marcasRelacionadas.length === 0) return ""

  // Seleccionar hasta 4 marcas aleatorias
  const marcasSeleccionadas = marcasRelacionadas.sort(() => 0.5 - Math.random()).slice(0, 4)

  let html = `<h2>También reparamos ${dispositivo.nombre} de otras marcas en ${ciudad.nombre}</h2>`
  html += '<ul class="marcas-relacionadas">'

  marcasSeleccionadas.forEach((marca) => {
    const dispositivoEnMarca = marca.dispositivos.find((d) => d.nombre === dispositivo.nombre)
    if (dispositivoEnMarca) {
      const url = `/reparacion-${dispositivoEnMarca.slug}-${marca.slug}-${ciudad.slug}.html`
      html += `<li><a href="${url}">Reparación de ${dispositivo.nombre} ${marca.nombre} en ${ciudad.nombre}</a></li>`
    }
  })

  html += "</ul>"

  return html
}

// Función para generar la sección de información adicional
export function generarInformacionAdicional(ciudad: Ciudad): string {
  let html = `<h2>Información adicional sobre reparaciones en ${ciudad.nombre}</h2>`
  html += `<div class="informacion-adicional">
    <p>${ciudad.informacion_adicional}</p>
  </div>`

  return html
}

// Función para generar la sección de contacto
export function generarContacto(): string {
  const html = `
    <div class="contacto-seccion">
      <h2>Contacte con nuestro servicio técnico</h2>
      <p>Para solicitar una reparación o recibir más información, puede contactarnos a través de nuestro teléfono de atención al cliente:</p>
      <div class="contacto-telefono">
        <a href="tel:910202901" class="boton-telefono">
          <span class="icono-telefono">📞</span>
          <span class="numero-telefono">910 202 901</span>
        </a>
      </div>
      <p class="contacto-horario">Horario de atención: Lunes a Viernes de 9:00 a 20:00h y Sábados de 9:00 a 14:00h</p>
    </div>
  `

  return html
}

// Función principal para generar el contenido completo de una página
export function generarContenidoPagina(
  marca: Marca,
  dispositivo: Dispositivo,
  ciudad: Ciudad,
  todasLasMarcas: Marca[],
): string {
  const titulo = generarTitulo(marca, dispositivo, ciudad)
  const metaDescripcion = generarMetaDescripcion(marca, dispositivo, ciudad)

  // Generar secciones de contenido
  const introduccion = generarIntroduccion(marca, dispositivo, ciudad)
  const problemasComunes = generarProblemasComunes(dispositivo)
  const zonasServicio = generarZonasServicio(ciudad)
  const serviciosDisponibles = generarServiciosDisponibles(ciudad)
  const procesoReparacion = generarProcesoReparacion()
  const ventajas = generarVentajas(marca)
  const dispositivosRelacionados = generarDispositivosRelacionados(marca, dispositivo, ciudad)
  const marcasRelacionadas = generarMarcasRelacionadas(marca, dispositivo, ciudad, todasLasMarcas)
  const informacionAdicional = generarInformacionAdicional(ciudad)
  const contacto = generarContacto()

  // Crear array con todas las secciones para poder mezclarlas
  const secciones = [
    problemasComunes,
    zonasServicio,
    serviciosDisponibles,
    procesoReparacion,
    ventajas,
    dispositivosRelacionados,
    marcasRelacionadas,
    informacionAdicional,
  ]

  // Mezclar las secciones para tener un orden diferente cada vez
  const seccionesMezcladas = [...secciones].sort(() => 0.5 - Math.random())

  // La introducción siempre va al principio y el contacto siempre al final
  seccionesMezcladas.unshift(introduccion)
  seccionesMezcladas.push(contacto)

  // Construir el HTML completo
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
  <meta name="description" content="${metaDescripcion}">
  <meta name="keywords" content="reparación ${dispositivo.nombre}, ${marca.nombre}, ${ciudad.nombre}, servicio técnico, reparación electrodomésticos">
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
    ul li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    ul li:last-child {
      border-bottom: none;
    }
    a {
      color: #2874a6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .ventajas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .ventaja-item {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .proceso-reparacion {
      margin-top: 20px;
    }
    .proceso-paso {
      display: flex;
      margin-bottom: 20px;
      align-items: flex-start;
    }
    .paso-numero {
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
    .paso-contenido {
      flex-grow: 1;
    }
    .zonas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 20px;
    }
    .zona-item {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
    }
    .servicios-disponibles {
      margin-top: 20px;
    }
    .servicio-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .servicio-icono {
      color: #2ecc71;
      font-weight: bold;
      margin-right: 10px;
    }
    .contacto-seccion {
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-top: 40px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .contacto-telefono {
      margin: 20px 0;
    }
    .boton-telefono {
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
    .boton-telefono:hover {
      background-color: #1a5276;
      text-decoration: none;
    }
    .icono-telefono {
      margin-right: 10px;
    }
    .contacto-horario {
      font-size: 14px;
      color: #666;
    }
    .problemas-comunes ul li {
      margin-bottom: 10px;
    }
    .informacion-adicional {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }
    @media (max-width: 768px) {
      .ventajas-grid, .zonas-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <h1>${titulo}</h1>
  ${seccionesMezcladas.join("\n")}
</body>
</html>
  `

  return htmlContent
}
