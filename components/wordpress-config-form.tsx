"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Loader2, Check, AlertTriangle } from "lucide-react"
import { wordPressService, type WordPressConfig } from "@/lib/wordpress-service"

interface WordPressConfigFormProps {
  onConfigSaved: (config: WordPressConfig) => void
  initialConfig?: WordPressConfig
}

export function WordPressConfigForm({ onConfigSaved, initialConfig }: WordPressConfigFormProps) {
  const [config, setConfig] = useState<WordPressConfig>(() => {
    // Usar configuración inicial o valores predeterminados
    return (
      initialConfig || {
        siteUrl: "",
        username: "",
        password: "",
        applicationPassword: "",
        useApplicationPassword: true,
      }
    )
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambio en el switch de contraseña de aplicación
  const handleSwitchChange = (checked: boolean) => {
    setConfig((prev) => ({ ...prev, useApplicationPassword: checked }))
  }

  // Verificar la conexión con WordPress
  const handleVerifyConnection = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validar URL
      if (!config.siteUrl) {
        throw new Error("La URL del sitio es obligatoria")
      }

      // Asegurarse de que la URL tenga el formato correcto
      let url = config.siteUrl
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
        setConfig((prev) => ({ ...prev, siteUrl: url }))
      }

      // Validar credenciales
      if (!config.username) {
        throw new Error("El nombre de usuario es obligatorio")
      }

      if (config.useApplicationPassword) {
        if (!config.applicationPassword) {
          throw new Error("La contraseña de aplicación es obligatoria cuando se usa este método")
        }
      } else {
        if (!config.password) {
          throw new Error("La contraseña es obligatoria cuando no se usa contraseña de aplicación")
        }
      }

      // Establecer la configuración en el servicio
      wordPressService.setConfig(config)

      // Verificar la conexión
      await wordPressService.verifyConnection()

      setSuccess("Conexión exitosa con WordPress")
      onConfigSaved(config)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar la conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuración de WordPress</CardTitle>
        <CardDescription>
          Configure la conexión a su sitio WordPress para exportar contenido directamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="siteUrl">URL del sitio WordPress</Label>
          <Input
            id="siteUrl"
            name="siteUrl"
            placeholder="https://ejemplo.com"
            value={config.siteUrl}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            Ingrese la URL completa de su sitio WordPress, incluyendo http:// o https://
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input id="username" name="username" placeholder="admin" value={config.username} onChange={handleChange} />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="useApplicationPassword"
            checked={config.useApplicationPassword}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="useApplicationPassword">Usar contraseña de aplicación (recomendado)</Label>
        </div>

        {config.useApplicationPassword ? (
          <div className="space-y-2">
            <Label htmlFor="applicationPassword">Contraseña de aplicación</Label>
            <Input
              id="applicationPassword"
              name="applicationPassword"
              type="password"
              placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
              value={config.applicationPassword}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Las contraseñas de aplicación son más seguras. Puede crear una en su perfil de WordPress en Seguridad &gt;
              Contraseñas de aplicación.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={config.password}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground text-amber-500">
              Nota: Usar la contraseña principal es menos seguro. Recomendamos usar contraseñas de aplicación.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleVerifyConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando conexión...
            </>
          ) : (
            "Verificar conexión"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
