# AnythingLLM — Autonomous Software Engineer Configuration

Sistema de ingeniería de software autónoma para **AnythingLLM + Ollama**. Convierte un LLM local en un ingeniero estructurado, determinístico y con memoria persistente real entre sesiones.

---

## 🚀 Características Principales

- **Memoria Autónoma Real**: La IA lee y escribe sus propios archivos de contexto a través de una Agent Skill (Node.js), sin necesidad de RAG ni subida manual de documentos.
- **Aislamiento por Proyecto**: Cada proyecto tiene su propio archivo de memoria (`proyectos/[nombre].txt`) con backup automático. El contexto no se mezcla entre proyectos.
- **Arquitectura Multi-Rol**: El LLM simula internamente 4 roles secuenciales — `ENGINEER`, `DEBUGGER`, `ARCHITECT`, `REVIEWER` — antes de entregar una respuesta.
- **Pipeline Estructurado**: Fases definidas de carga de memoria → detección → selección de modo → ejecución → validación → persistencia.
- **Modos de Operación**: `Automático` | `Controlado` | `Ultra Debug` | `Arquitecto` | `Refactor` | `Performance` | `Minimal` | `Mentor` | `Sesión Rápida`
- **Detección Automática**: Lenguaje, tipo de tarea y cambio de proyecto detectados sin intervención del usuario.

---

## 🧠 Sistema de Memoria (Agent Skill)

La skill `agent-skill-memoria` provee **lectura y escritura directa en disco** sin depender del vector store de AnythingLLM.

### Acciones disponibles (`action`)

| Acción | Parámetros | Descripción |
|--------|-----------|-------------|
| `read` | `filename` | Lee un archivo de memoria y devuelve su contenido al LLM |
| `write` | `filename`, `content` | Agrega contenido con timestamp automático. Genera backup para archivos de proyectos/ |
| `list` | — | Lista todos los proyectos guardados en `memoria/proyectos/` |
| `delete` | `filename` | Elimina un archivo de memoria |
| `clear` | `filename` | Vacía un archivo sin eliminarlo |
| `summary` | — | Devuelve un resumen consolidado de toda la memoria |

### Archivos de memoria

**Globales** (siempre se cargan al inicio de sesión):
- `proyecto_activo.txt` — Proyecto en curso y su contexto
- `memoria_global.txt` — Preferencias permanentes del usuario
- `decisiones_usuario.txt` — Decisiones técnicas explícitas del usuario
- `patrones_detectados.txt` — Comportamiento recurrente detectado (3+ veces)
- `historial_errores.txt` — Errores resueltos y soluciones aplicadas

**Por proyecto** (se cargan solo si hay proyecto activo):
- `proyectos/[nombre].txt` — Arquitectura, stack y convenciones del proyecto
- `proyectos/[nombre]_decisiones.txt` — Decisiones técnicas del proyecto
- `proyectos/[nombre]_backup.txt` — Backup automático (generado por la skill)

---

## 🎭 Pipeline de Ejecución

```
PRE-CHECK  →  ¿Es sesión rápida? (saltar Paso B y fases 6-7 si es pregunta general)
FASE -1    →  Carga de memoria (Paso A: globales / Paso B: proyecto activo)
FASE 1     →  Selector inteligente (detectar modo)
FASE 2     →  Detección de tarea y lenguaje
FASE 3-5   →  Activación de módulos RAG relevantes
FASE 6     →  Multi-agente interno (Engineer → Debugger → Architect → Reviewer)
FASE 7     →  Validación final (métricas de calidad)
FASE 8     →  Adaptación al perfil del usuario
FASE 9     →  Persistencia en memoria (skill write si hay datos confirmados)
```

---

## 🗂 Estructura del Proyecto

| Directorio | Propósito |
|------------|-----------|
| 🧠 `core/` | System prompt central, pipeline de ejecución, selector inteligente, motor de decisión |
| 🛡 `reglas/` | Anti-patrones, seguridad, git, revisor de código, testing, API REST, UI/UX |
| 📚 `stack/` | Reglas y debug por lenguaje: PHP, JS/TS, Python, SQL, Flutter/Dart, HTML/CSS, Bash |
| 🏗 `arquitectura/` | Patrones de diseño, decisiones arquitectónicas, manejo de conflictos |
| 💾 `memoria/` | Archivos de contexto persistente accedidos directamente por la skill (sin RAG) |
| ⚙️ `modos/` | Definición de cada modo de operación del agente |
| 👤 `usuario/` | Perfil técnico del usuario para calibrar respuestas |
| 🔌 `plugins/` | Agent Skills de AnythingLLM (`agent-skill-memoria` v3.0.0) |

---

## 🛠 Instalación

1. Abre AnythingLLM y crea o selecciona un Workspace.
2. Copia el contenido de `core/SYSTEM_PROMPT_ANYTHINGLLM.txt` en el **System Prompt** del Workspace.
3. Sube todos los `.txt` **excepto los de `memoria/`** al área de documentos y vectorízalos.  
   > Los archivos de `memoria/` son leídos y escritos directamente por la skill — **no necesitan subirse al RAG**.
4. Copia la carpeta `plugins/agent-skill-memoria/` al directorio de plugins de AnythingLLM y actívala desde la interfaz.
5. Usa un modelo orientado a código: `qwen2.5-coder`, `deepseek-coder-v2`, o similar.

---

## 🎮 Comandos del Usuario

| Comando | Resultado |
|---------|-----------|
| `"SESIÓN: [fecha] PROYECTO: [nombre] ..."` | Carga contexto de inicio de sesión completo |
| `"sesión rápida"` | Activa modo sin carga de memoria ni multi-agente |
| `"¿qué recuerdas?"` | Ejecuta `skill summary` y muestra toda la memoria |
| `"olvida esto"` | Ejecuta `skill delete` o `skill clear` sobre la última entrada |
| `"corrige memoria"` | Ejecuta `skill write` con el contenido corregido |
| `"reset proyecto"` | Limpia `proyecto_activo.txt` y el archivo del proyecto activo |
| `"modo [nombre]"` | Fuerza un modo específico (refactor, arquitecto, debug, etc.) |
| `"--ayuda"` | Muestra la plantilla de ayuda del sistema |

---

## 🎭 Roles del Multi-Agente Interno

| Rol | Función |
|-----|---------|
| `ENGINEER` | Genera la solución de código |
| `DEBUGGER` | Detecta errores y edge cases en la solución |
| `ARCHITECT` | Evalúa coherencia de diseño y arquitectura |
| `REVIEWER` | Valida calidad, seguridad y completitud final |

Si un rol detecta un problema → la solución se regenera antes de responder al usuario.

---

> Para detalles técnicos sobre el comportamiento de AnythingLLM con documentos y RAG, ver [`README_ANYTHINGLLM.md`](./README_ANYTHINGLLM.md).
