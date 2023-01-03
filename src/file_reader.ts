import fs from "fs";
import path from "path";

export interface IFile {
  name: string;
  path: string;
  ext: string;
}

function allowExt(): string[] {
  return [".js", ".json", ".py", ".rb", ".swift", ".c", ".m", ".md", ".log", ".sh"];
}

export async function getFileList(dir: string): Promise<IFile[]> {
  const nameList = await fs.promises.readdir(dir);
  const list: IFile[] = [];
  for (const name of nameList) {
    const ext = path.extname(name);
    if (!allowExt().includes(ext)) continue;
    list.push({
      name,
      path: path.join(dir, name),
      ext,
    });
  }
  return list;
}
