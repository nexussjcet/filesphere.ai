"use server";

import { signIn } from "@/auth";
import os from "os";

const OSList = ["Windows", "MacOS", "Linux", "Android", "iOS"];

export const handleSubmit = async () => {
  "use server";
  return signIn("google");
};

export async function getUserDeviceInfo(): Promise<string | undefined> {
  const userOS: string = os.type();
  const device = OSList.find((os) => userOS.includes(os)) ?? "Unknown Device";
  return device;
}
