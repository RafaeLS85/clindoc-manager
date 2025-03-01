// src/types/api.d.ts
export interface API {
  readDocx(filePath: string): Promise<string>
  // Puedes agregar otros métodos que expongas.
}
