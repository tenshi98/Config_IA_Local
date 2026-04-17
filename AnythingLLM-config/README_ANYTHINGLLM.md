# README — Sistema de Ingeniería Autónoma con AnythingLLM

Sistema de prompts que convierte un LLM local (Ollama) en un ingeniero de software
determinístico con memoria persistente, roles internos y modos de operación especializados.

---

## Estructura del Sistema

```
ollama-config/
├── core/                        → cerebro central
│   ├── MASTER_PROMPT.txt        → definición completa del sistema
│   ├── SYSTEM_PROMPT_ANYTHINGLLM.txt  ← PEGAR EN ANYTHINGLLM
│   ├── pipeline_ejecucion.txt   → flujo de 10 fases
│   ├── selector_inteligente.txt → selección automática de modo
│   ├── multi_agente.txt         → sub-agentes internos
│   ├── motor_decision.txt       → priorización de decisiones
│   ├── auto_mejora.txt          → protocolo de aprendizaje
│   ├── protocolo_memoria.txt    → sistema de memoria para AnythingLLM
│   ├── plantillas_respuesta.txt → formato de salida por tipo de tarea
│   └── metricas_calidad.txt     → qué significa "calidad"
│
├── modos/                       → comportamientos especializados
│   ├── modo_automatico          → (default, sin archivo propio)
│   ├── modo_controlado.txt      → exige datos antes de ejecutar
│   ├── modo_documentacion_estricta.txt → solo documenta
│   ├── modo_ultra_debug.txt     → análisis profundo de errores
│   ├── modo_arquitecto.txt      → diseño de sistemas
│   ├── modo_refactor.txt        → mejora estructura sin cambiar comportamiento
│   └── modo_operacion_pro.txt   → referencia de todos los modos
│
├── reglas/                      → restricciones y validaciones
│   ├── core_rules.txt
│   ├── reglas_contexto.txt
│   ├── reglas_preventivas.txt
│   ├── anti_patrones.txt        → anti-patrones por lenguaje
│   ├── reglas_seguridad.txt     → vulnerabilidades por lenguaje
│   ├── reglas_git.txt           → Conventional Commits, branching
│   └── reglas_revisor.txt       → checklist del agente REVIEWER
│
├── stack/                       → reglas por lenguaje/tecnología
│   ├── stack_tecnologico.txt    → stack global del usuario
│   ├── detector_lenguaje.txt    → detección automática
│   ├── php/                     → reglas_php, debug_php
│   ├── javascript/              → reglas_js, debug_js
│   ├── typescript/              → reglas_typescript, debug_typescript
│   ├── python/                  → reglas_python, debug_python
│   ├── sql/                     → reglas_sql, debug_sql
│   ├── bash/                    → reglas_bash, debug_bash
│   ├── flutter/                 → reglas_flutter, debug_flutter
│   └── html_css/                → reglas_html_css, accesibilidad
│
├── arquitectura/
│   ├── decisiones_arquitectura.txt
│   ├── conflictos.txt           → prioridad ante conflictos
│   └── patrones_arquitectura.txt → catálogo de patrones con criterios
│
├── memoria/                     → persistencia de contexto
│   ├── proyecto_activo.txt      → proyecto en curso
│   ├── proyectos/[nombre_proyecto].txt     → contexto acumulado del proyecto
│   ├── memoria_global.txt       → preferencias del usuario
│   ├── decisiones_usuario.txt   → decisiones técnicas confirmadas
│   ├── patrones_detectados.txt  → comportamiento recurrente
│   ├── historial_errores.txt    → errores resueltos
│   ├── control_memoria.txt      → reglas de integridad
│   └── inicio_sesion.txt        → plantilla de inicio de sesión
│
└── usuario/
    └── perfil_usuario.txt       → nivel técnico, preferencias, stack
```

---

## Configuración en AnythingLLM

### Paso 1 — System Prompt

1. Abrir AnythingLLM → tu workspace
2. Ir a **Settings → LLM Preference** o **Workspace Settings**
3. Copiar el contenido completo de `core/SYSTEM_PROMPT_ANYTHINGLLM.txt`
4. Pegarlo en el campo **System Prompt**
5. Guardar

> El System Prompt se carga en TODAS las conversaciones. Es el núcleo del sistema.

### Paso 2 — Subir documentos al workspace

Subir TODOS los archivos .txt del proyecto al workspace de AnythingLLM:

1. Ir a tu workspace → **Upload Documents**
2. Subir todos los archivos por carpeta
3. Verificar que estén indexados (aparecen en el sidebar)

AnythingLLM recuperará los documentos relevantes automáticamente via RAG
según el contenido de cada conversación.

### Paso 3 — Configurar el modelo

Modelos recomendados (via Ollama):
- **qwen2.5-coder** → mejor para código
- **deepseek-coder-v2** → alternativa sólida
- **llama3.1** → buena comprensión general

Parámetros sugeridos:
- Temperature: 0.1–0.3 (determinístico)
- Context length: máximo disponible (importante para cargar memoria)

---

## Uso Diario

### Iniciar una sesión

Copiar al primer mensaje del chat:

```
SESIÓN: 2026-04-05
PROYECTO: nombre-del-proyecto
OBJETIVO HOY: qué quiero hacer hoy
CONTINUANDO DESDE: última tarea
MODO FORZADO: ninguno
RESTRICCIONES ACTIVAS: ninguna
```

### Forzar un modo

Escribir directamente:
- `"modo ARQUITECTO"` → activa modo_arquitecto
- `"modo ULTRA_DEBUG"` → activa análisis profundo
- `"modo REFACTOR"` → activa modo_refactor
- `"modo DOCUMENTACION"` → activa modo_documentacion_estricta
- `"modo MINIMAL"` → solo código, sin explicación

### Comandos de memoria e interacción

| Comando | Acción |
|---------|--------|
| `"--ayuda"` | Muestra guía de prompts, modos disponibles y comandos |
| `"¿qué recuerdas?"` | Resume la memoria cargada |
| `"olvida esto"` | Elimina la última entrada de memoria |
| `"corrige memoria"` | Emite bloque corregido |
| `"reset proyecto"` | Limpia proyectos/[nombre_proyecto].txt |
| `"actualiza memoria"` | Emite todos los bloques pendientes |

### Actualizar memoria manualmente

Cuando el sistema emita un bloque:

```
---MEMORIA_UPDATE---
ARCHIVO: proyectos/[nombre_proyecto].txt
OPERACIÓN: AGREGAR
CLAVE: ARQUITECTURA
VALOR: [2026-04-05] Clean Architecture con Riverpod en Flutter
---FIN_MEMORIA---
```

1. Copiar el VALOR
2. Abrir el archivo indicado
3. Agregar la entrada con el formato: `[FECHA] CLAVE: valor`
4. Guardar y re-subir el archivo a AnythingLLM si cambió

---

## Cambiar de Proyecto

1. Editar `memoria/proyecto_activo.txt` con el nuevo proyecto
2. Editar `memoria/proyectos/[nombre_proyecto].txt` si hay contexto previo relevante
3. Re-subir ambos archivos a AnythingLLM
4. Iniciar sesión con el bloque SESIÓN actualizado

O simplemente escribir: `"reset proyecto"` para que el sistema emita el bloque de limpieza.

---

## Actualizar el Sistema

Cuando edites cualquier archivo:
1. Guardar el archivo
2. En AnythingLLM → re-subir el archivo modificado (actualiza el índice)
3. El sistema usará la versión actualizada en la próxima conversación

---

## Tipos de Tarea Reconocidos

| Tipo | Cuándo activar | Modo |
|------|---------------|------|
| CREATE | generar código nuevo | automático |
| DEBUG | encontrar y corregir errores | ultra_debug si es complejo |
| DOCUMENT | documentar código existente | documentacion_estricta (aislado) |
| ARCHITECTURE | diseñar sistemas | modo_arquitecto (aislado) |
| REFACTOR | mejorar estructura sin cambiar comportamiento | modo_refactor |
| GENERAL | consultas, preguntas | automático |

---

## Scorecard del Sistema

| Dimensión | Estado |
|-----------|--------|
| Pipeline de ejecución | ✅ 10 fases completas |
| Memoria persistente | ✅ 7 archivos + protocolo |
| Detección de lenguaje | ✅ PHP, JS, TS, SQL, Flutter, HTML/CSS |
| Modos de operación | ✅ 6 modos definidos |
| Reglas de seguridad | ✅ por lenguaje |
| Sub-agentes internos | ✅ ENGINEER, DEBUGGER, ARCHITECT, REVIEWER |
| Patrones arquitectónicos | ✅ catálogo con criterios |
| Compatibilidad AnythingLLM | ✅ RAG + System Prompt compilado |
