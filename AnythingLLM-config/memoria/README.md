# 💾 Sistema de Memoria Persistente

Este directorio contiene los archivos de memoria que la IA utiliza para mantener contexto entre sesiones.

## Archivos y Propósito

| Archivo | Propósito | Actualización |
|---------|-----------|---------------|
| `proyectos/[nombre]_ajustes.txt`| Ajustes e historial específicos de UN solo proyecto | Automático por IA |
| `proyecto_activo.txt` | Contexto del proyecto en curso (dice cuál es el proyecto actual) | Al cambiar de proyecto |
| `memoria_global.txt` | Preferencias generales del usuario que aplican a todos los proyectos | Cuando el usuario define una preferencia global |
| `patrones_detectados.txt` | Comportamientos recurrentes del usuario (detectados automáticamente) | Automático tras 3+ repeticiones |
| `historial_errores.txt` | Registro de errores complejos resueltos y sus soluciones | Tras resolver un error relevante |
| `control_memoria.txt` | Reglas internas para validar qué se guarda y qué no | Archivo de reglas (no cambia frecuentemente) |
| `inicio_sesion.txt` | Plantilla que el usuario copia al inicio de cada chat para cargar contexto | Archivo de plantilla (no cambia) |

## Prioridad de Consulta

Cuando la IA carga memoria, lo hace en este orden de prioridad:

1. `decisiones_usuario.txt` — Lo que el usuario confirmó explícitamente
2. `proyecto_activo.txt` — El contexto del proyecto en curso
3. `proyectos/[nombre_proyecto].txt` — Arquitectura y convenciones
4. `memoria_global.txt` — Preferencias generales
5. `patrones_detectados.txt` — Comportamiento recurrente
6. `historial_errores.txt` — Errores resueltos

## Comandos de Control

| Comando | Acción |
|---------|--------|
| `"¿qué recuerdas?"` | Resumen de la memoria cargada actualmente |
| `"olvida esto"` | Elimina la última entrada registrada |
| `"corrige memoria"` | Solicita un bloque corregido |
| `"reset proyecto"` | Limpia `proyectos/[nombre_proyecto].txt` para un nuevo proyecto |
| `"actualiza memoria"` | Emite todos los bloques pendientes |

## Actualización Autónoma

El sistema utiliza el Agent Skill `Update Project Memory` (en `plugins/agent-skill-memoria/`) para escribir directamente en estos archivos sin intervención manual del usuario.

## Formato de Entradas

Todas las entradas siguen el formato:
```
[YYYY-MM-DD] CLAVE: valor
```

Ejemplo:
```
[2026-04-06] ARQUITECTURA: Se usa Clean Architecture en Flutter con Riverpod
```
