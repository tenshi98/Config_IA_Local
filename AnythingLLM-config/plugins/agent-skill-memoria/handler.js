const fs   = require('fs');
const path = require('path');

const BASE_PATH = '/mnt/Desarrollos/Github/ia_configs/AnythingLLM-config/memoria';

const ALLOWED_FILES = [
  "proyecto_activo.txt",
  "memoria_global.txt",
  "memoria_proyecto.txt",
  "decisiones_usuario.txt",
  "patrones_detectados.txt",
  "historial_errores.txt"
];

// Soporta: proyectos/nombre.txt, proyectos/nombre_decisiones.txt, proyectos/nombre_backup.txt, etc.
function isAllowed(filename) {
  const isGlobal  = ALLOWED_FILES.includes(filename);
  const isProject = /^proyectos\/[a-zA-Z0-9][a-zA-Z0-9_\-]*\.txt$/.test(filename);
  return isGlobal || isProject;
}

// Tarea 3: auto-prefija [YYYY-MM-DD] si el contenido no trae fecha
function autoTimestamp(content) {
  if (/^\[\d{4}-\d{2}-\d{2}/.test(content.trim())) return content.trim();
  const today = new Date().toISOString().slice(0, 10);
  return `[${today}] ${content.trim()}`;
}

module.exports.runtime = {
  handler: async function ({ action, filename, content }) {
    try {

      // ── LIST (Tarea 1) ────────────────────────────────────────────────────
      if (action === 'list') {
        const proyectosDir = path.join(BASE_PATH, 'proyectos');
        if (!fs.existsSync(proyectosDir)) {
          return 'Info: La carpeta proyectos/ está vacía o no existe aún.';
        }
        const files = fs.readdirSync(proyectosDir)
          .filter(f => f.endsWith('.txt') && !f.endsWith('_backup.txt'))
          .sort();
        if (files.length === 0) return 'Info: No hay proyectos guardados en memoria aún.';
        return `[PROYECTOS EN MEMORIA]\n${files.map(f => `- proyectos/${f}`).join('\n')}`;
      }

      // ── SUMMARY (Tarea 9) ─────────────────────────────────────────────────
      if (action === 'summary') {
        const filesToRead = [...ALLOWED_FILES];
        const proyectosDir = path.join(BASE_PATH, 'proyectos');
        if (fs.existsSync(proyectosDir)) {
          fs.readdirSync(proyectosDir)
            .filter(f => f.endsWith('.txt') && !f.endsWith('_backup.txt'))
            .sort()
            .forEach(f => filesToRead.push(`proyectos/${f}`));
        }
        let summary = '[RESUMEN DE MEMORIA COMPLETA]\n';
        for (const fname of filesToRead) {
          const fpath = path.join(BASE_PATH, fname);
          if (!fs.existsSync(fpath)) continue;
          const data = fs.readFileSync(fpath, 'utf8').trim();
          if (!data) continue;
          summary += `\n--- ${fname} ---\n${data}\n`;
        }
        return summary.length > 35 ? summary : 'Info: No hay memoria guardada aún.';
      }

      // El resto de acciones requieren filename válido
      if (!filename) {
        return `Error: Se requiere 'filename' para la acción '${action}'.`;
      }
      if (!isAllowed(filename)) {
        return `Error: Archivo '${filename}' no permitido. Usar globales o formato 'proyectos/nombre.txt'`;
      }

      const targetPath = path.join(BASE_PATH, filename);

      // ── READ ──────────────────────────────────────────────────────────────
      if (action === 'read') {
        if (!fs.existsSync(targetPath)) {
          return `Info: El archivo '${filename}' aún no existe. No hay memoria guardada.`;
        }
        const data = fs.readFileSync(targetPath, 'utf8').trim();
        if (!data) return `Info: El archivo '${filename}' existe pero está vacío.`;
        return `[MEMORIA: ${filename}]\n${data}`;
      }

      // ── DELETE (Tarea 2) ──────────────────────────────────────────────────
      if (action === 'delete') {
        if (!fs.existsSync(targetPath)) {
          return `Info: El archivo '${filename}' no existe, nada que eliminar.`;
        }
        fs.unlinkSync(targetPath);
        return `[MEMORIA] Archivo '${filename}' eliminado correctamente.`;
      }

      // ── CLEAR (Tarea 2) — vacía el archivo sin eliminarlo ─────────────────
      if (action === 'clear') {
        if (!fs.existsSync(targetPath)) {
          return `Info: El archivo '${filename}' no existe.`;
        }
        fs.writeFileSync(targetPath, '', { encoding: 'utf8' });
        return `[MEMORIA] Archivo '${filename}' vaciado correctamente.`;
      }

      // ── WRITE (Tarea 3 + Tarea 10) ────────────────────────────────────────
      if (action === 'write') {
        if (!content || !content.trim()) {
          return `Error: No se puede escribir contenido vacío en '${filename}'.`;
        }

        // Tarea 3: timestamp automático
        const contentFinal = autoTimestamp(content);

        // Crear carpeta si no existe
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        if (fs.existsSync(targetPath)) {
          const current = fs.readFileSync(targetPath, 'utf8');

          // Evitar duplicados exactos
          if (current.includes(contentFinal)) {
            return `Info: El contenido ya existía en '${filename}'. No se hicieron cambios.`;
          }

          // Tarea 10: backup automático para archivos de proyectos/ antes de escribir
          const isProjectFile = /^proyectos\/[a-zA-Z0-9][a-zA-Z0-9_\-]*\.txt$/.test(filename);
          if (isProjectFile && current.trim()) {
            const backupPath = path.join(BASE_PATH, filename.replace('.txt', '_backup.txt'));
            fs.writeFileSync(backupPath, current, { encoding: 'utf8' });
          }
        }

        fs.appendFileSync(targetPath, `\n${contentFinal}`, { encoding: 'utf8' });
        return `[MEMORIA] Éxito: contenido guardado en '${filename}'.`;
      }

      return `Error: Acción '${action}' no reconocida. Acciones válidas: read | write | list | delete | clear | summary`;

    } catch (error) {
      return `Error crítico en skill de memoria: ${error.message}`;
    }
  }
};
