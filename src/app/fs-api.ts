import { userInfo, type } from "os"

import { spawn } from 'child_process';
import { constants, promises } from "fs";

const ignoreDirs = ['node_modules']
const otherFiles = ['docx', 'odt', 'pdf', 'xlsx', 'png', 'jpg', 'jpeg', 'webp']
const docFiles = ['docx', 'odt', 'pdf', 'xlsx', 'ods']
const imageFiles = ['png', 'jpg', 'jpeg', 'webp']

const getBasePath = () => {
    const platform = type()
    const username = userInfo().username
    let basePath
    if (platform === "Linux")
        basePath = `/home/${username}`
    else if (platform === 'MacOS')
        basePath = `/Users/${username}`
    return basePath
}

const readDir = async (directoryPath: string, includeHidden: boolean): Promise<{ success: boolean; files?: string[] }> => {
    try {
        const basePath = getBasePath();
        let child: any

        if (includeHidden)
            child = spawn('ls', ['-A', `${basePath}${directoryPath}`]);
        else
            child = spawn('ls', [`${basePath}${directoryPath}`]);
        const output: any = await new Promise((resolve, reject) => {
            let data = '';
            child.stdout.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });
            child.on('error', reject);
            child.on('close', (code: Number) => {
                if (code === 0) {
                    resolve(data);
                } else {
                    reject(new Error(`Failed to read directory: ${code}`));
                }
            });
        });

        const files = output.split('\n').slice(0, -1).filter((file: any) => !ignoreDirs.includes(file));
        return { success: true, files };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}

export const checkDir = async (path: string) => {
    try {
        await promises.access(path, constants.F_OK);
        return { success: true };
    } catch (err) {
        return { success: false };
    }
}

const makeDir = async (directoryPath: string) => {
    try {
        const basePath = getBasePath()
        const dirData = await checkDir(`${basePath}${directoryPath}`)
        if (dirData.success)
            return { success: false, message: "Folder Exists" }

        await promises.mkdir(`${basePath}${directoryPath}`)
        return { success: true };

    } catch (err) {
        return { success: false };
    }
}

const removeDir = async (directoryPath: string) => {
    try {
        const basePath = getBasePath()
        await promises.rmdir(`${basePath}${directoryPath}`);
        return { success: true };
    } catch (err) {
        return { success: false, message: "No directory found" };
    }
}

const readFile = async (filePath: string) => {
    try {
        const basePath = getBasePath()
        const path = `${basePath}${filePath}`;
        const files: any = filePath.split('/')
        const fileext = files[files.length - 1].split('.')[1]

        if (!otherFiles.includes(fileext)) {
            const body = await promises.readFile(path, 'utf-8');
            return { success: true, body }
        } else {
            let child: any
            if (imageFiles.includes(fileext))
                child = spawn('tesseract', [path, 'stdout']);
            else
                child = spawn('./conv', [path])

            const body: any = await new Promise((resolve, reject) => {
                let data = '';
                child.stdout.on('data', (chunk: Buffer) => {
                    data += chunk.toString();
                });
                child.on('error', reject);
                child.on('close', (code: Number) => {
                    if (code === 0) {
                        resolve(data);
                    } else {
                        reject(new Error(`Failed to read directory: ${code}`));
                    }
                });
            });
            if (docFiles.includes(fileext))
                return JSON.parse(body)
            else
                return { success: true, body }
        }
    } catch (error) {
        console.log(error);

        return { success: false };
    }
}

const removeFile = async (filePath: string) => {
    try {
        const basePath = getBasePath()
        await promises.rm(`${basePath}${filePath}`);
        return { success: true };
    } catch (err) {
        return { success: false, message: "No file found" };
    }
}

export { readDir, makeDir, removeDir, readFile, removeFile }