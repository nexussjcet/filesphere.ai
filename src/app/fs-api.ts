import { userInfo, type } from "os";

import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { constants, promises } from "fs";

const ignoreDirs = ["node_modules"];
const otherFiles = ["docx", "odt", "pdf", "xlsx", "png", "jpg", "jpeg", "webp"];
const docFiles = ["docx", "odt", "pdf", "xlsx", "ods"];
const imageFiles = ["png", "jpg", "jpeg", "webp"];

const getBasePath = () => {
  const platform = type();
  const username = userInfo().username;
  let basePath = "";
  if (platform === "Linux") basePath = `/home/${username}`;
  else if (platform === "MacOS") basePath = `/Users/${username}`;
  return basePath;
};

export const readDir = async (
  directoryPath: string,
  includeHidden: boolean,
): Promise<{ success: boolean; data?: object }> => {
  try {
    const basePath = getBasePath();
    const path = `${basePath}${directoryPath}`;
    let child: ChildProcessWithoutNullStreams;

    if (includeHidden) child = spawn("ls", ["-A", path]);
    else child = spawn("ls", [path]);
    const output: string = await new Promise((resolve, reject) => {
      let data = "";
      child.stdout.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      child.on("error", reject);
      child.on("close", (code: number) => {
        if (code === 0) {
          resolve(data);
        } else {
          reject(new Error(`Failed to read directory: ${code}`));
        }
      });
    });

    const files = output
      .split("\n")
      .slice(0, -1)
      .filter((file) => !ignoreDirs.includes(file));
    return {
      success: true,
      data: {
        absPath: path,
        path: directoryPath,
        files,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const checkDir = async (path: string) => {
  try {
    await promises.access(path, constants.F_OK);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

export const isDir = async (directoryPath: string) => {
  try {
    const basePath = getBasePath();
    const path = `${basePath}${directoryPath}`;
    const stats = await promises.stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
};

export const makeDir = async (directoryPath: string) => {
  try {
    const basePath = getBasePath();
    const dirData = await checkDir(`${basePath}${directoryPath}`);
    if (dirData.success) return { success: false };

    await promises.mkdir(`${basePath}${directoryPath}`);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

export const removeDir = async (directoryPath: string) => {
  try {
    const basePath = getBasePath();
    await promises.rmdir(`${basePath}${directoryPath}`);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

export const readFile = async (filePath: string) => {
  try {
    const basePath = getBasePath();
    const path = `${basePath}${filePath}`;
    const files = filePath.split("/");
    const fileext = files[files.length - 1]?.split(".")[1] ?? "";

    if (!otherFiles.includes(fileext)) {
      const data = await promises.readFile(path, "utf-8");
      return { success: true, data };
    }
    let child: ChildProcessWithoutNullStreams;
    if (imageFiles.includes(fileext))
      child = spawn("tesseract", [path, "stdout"]);
    else child = spawn("./go-conv/conv", [path, "r", ""]);

    const data:string = await new Promise((resolve, reject) => {
      let data = "";
      child.stdout.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      child.on("error", reject);
      child.on("close", (code: number) => {
        if (code === 0) {
          resolve(data);
        } else {
          reject(new Error(`Failed to read directory: ${code}`));
        }
      });
    });
    if (docFiles.includes(fileext)) {
      const {text, success} = JSON.parse(data) as object as {text:string, success:boolean}
      return {
        data:text,
        success,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);

    return { success: false };
  }
};

export const writeFile = async (filePath: string, content: string) => {
  try {
    const basePath = getBasePath();
    const path = `${basePath}${filePath}`;
    const files = filePath.split("/");
    const fileext = files[files.length - 1]?.split(".")[1] ?? "";

    if (!otherFiles.includes(fileext)) {
      await promises.writeFile(path, content);
      return { success: true };
    }
    await promises.writeFile(".temp.txt", content);
    let child: ChildProcessWithoutNullStreams;
    if (docFiles.includes(fileext))
      child = spawn("./go-conv/conv", [path, "w", content]);

    const data = await new Promise((resolve, reject) => {
      let data = "";
      child.stdout.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      child.on("error", reject);
      child.on("close", (code: number) => {
        if (code === 0) {
          resolve(data);
        } else {
          reject(new Error(`Failed to read directory: ${code}`));
        }
      });
    });

    return { success: true };
  } catch (error) {
    console.log(error);

    return { success: false };
  }
};

export const removeFile = async (filePath: string) => {
  try {
    const basePath = getBasePath();
    await promises.rm(`${basePath}${filePath}`);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};
