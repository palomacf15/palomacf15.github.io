import { exec } from "child_process";
import { readdir, rename, rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ejecutar el comando npm run build
exec("npm run build", async (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar npm run build: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
  }
  console.log(stdout);

  // Ruta de la carpeta dist
  const distPath = path.join(__dirname, "../dist");
  const rootPath = path.join(__dirname, "..");

  try {
    // Verificar si la carpeta dist existe
    const files = await readdir(distPath);

    // Mover el contenido de dist a la raíz
    for (const file of files) {
      const srcPath = path.join(distPath, file);
      const destPath = path.join(rootPath, file);
      await rename(srcPath, destPath);
    }

    // Eliminar la carpeta dist
    await rm(distPath, { recursive: true, force: true });
    console.log("Contenido de dist movido a la raíz y carpeta dist eliminada.");

    // Eliminar las carpetas src y public
    const foldersToDelete = ["src", "public"];
    for (const folder of foldersToDelete) {
      const folderPath = path.join(rootPath, folder);
      await rm(folderPath, { recursive: true, force: true });
      console.log(`Carpeta ${folder} eliminada.`);
    }

    console.log("Script completado.");
  } catch (err) {
    console.error(`Error durante el proceso: ${err.message}`);
  }
});