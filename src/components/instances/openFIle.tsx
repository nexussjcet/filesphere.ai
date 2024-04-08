"use client"

import { type AFC } from "@/lib/schema";
import popupCenter from "@/lib/window";
import { useEffect } from "react";

export const openFile: AFC<"openFile"> = ({ data }) => {
    useEffect(() => (
        popupCenter(data.fileSource, "Open File")
    ), [])
    return (
        <div>
            <div>{data.fileSource}</div>
        </div>
    );
}