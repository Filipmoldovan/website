import { JSDOM } from "jsdom"
import { validateAndFixHtml } from "@/lib/html-validator"

/**
 * Analiza una cadena HTML y devuelve un objeto Document
 */
export function parseHtml(html: string): Document {
  const dom = new JSDOM(html)
  return dom.window.document
}

/**
 * Verifica si el HTML es válido y devuelve un objeto con el resultado
 */
export function validateHtml(html: string) {
  return validateAndFixHtml(html).originalValidation
}

/**
 * Cuenta el número de elementos que coinciden con un selector
 */
export function countElements(document: Document, selector: string): number {
  return document.querySelectorAll(selector).length
}

/**
 * Verifica si un elemento existe en el documento
 */
export function elementExists(document: Document, selector: string): boolean {
  return document.querySelector(selector) !== null
}

/**
 * Verifica si un texto existe en el documento
 */
export function textExists(document: Document, text: string): boolean {
  return document.body.textContent?.includes(text) || false
}

/**
 * Verifica si hay elementos anidados incorrectamente
 */
export function hasInvalidNesting(document: Document): boolean {
  // Verificar <p> con elementos de bloque dentro
  const paragraphs = document.querySelectorAll("p")
  for (const p of paragraphs) {
    const hasBlockElements = p.querySelectorAll("div, ul, ol, table, h1, h2, h3, h4, h5, h6").length > 0
    if (hasBlockElements) {
      return true
    }
  }

  // Verificar <a> con elementos <a> anidados
  const links = document.querySelectorAll("a")
  for (const a of links) {
    if (a.querySelectorAll("a").length > 0) {
      return true
    }
  }

  return false
}

/**
 * Verifica si hay elementos sin cerrar
 */
export function hasUnclosedElements(html: string): boolean {
  // Lista de elementos que requieren cierre
  const elementsRequiringClosure = [
    "div",
    "span",
    "p",
    "a",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "table",
    "tr",
    "td",
    "th",
    "form",
    "input",
    "select",
    "textarea",
    "button",
    "section",
    "article",
    "header",
    "footer",
    "nav",
  ]

  // Contar etiquetas de apertura y cierre
  for (const element of elementsRequiringClosure) {
    const openingTags = (html.match(new RegExp(`<${element}(\\s|>)`, "g")) || []).length
    const closingTags = (html.match(new RegExp(`</${element}>`, "g")) || []).length

    if (openingTags !== closingTags) {
      return true
    }
  }

  return false
}
