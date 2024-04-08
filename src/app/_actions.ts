"use server";

import { signIn,signOut } from "@/auth";
import os from "os";

const OSList = ["Windows", "MacOS", "Linux", "Android", "iOS"];

export const handleLogin = async () => {
  "use server";
  return signIn("google");
};

export const handleLogout = async () => {
  "use server";
  return signOut();
};

export async function getUserDeviceInfo(): Promise<string | undefined> {
  const userOS: string = os.type();
  const device = OSList.find((os) => userOS.includes(os)) ?? "Unknown Device";
  return device;
}
