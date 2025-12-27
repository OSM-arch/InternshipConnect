import {LayoutGrid} from "lucide-react";
import React from "react";

export default function Logo() {
    return (<div className="mb-2 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-green-500">
                <LayoutGrid className="text-green-950" />
            </div>
            <h1 className="text-blue-200 text-2xl font-bold tracking-tight">StageConnect</h1>
    </div>)
}