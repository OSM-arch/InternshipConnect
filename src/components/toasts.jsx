import { Info, CircleCheck } from "lucide-react";
import {useContext} from "react";
import {contextStore} from "@/app/auth/layout";

// signup / login
export function AlertToast() {

    const {states: [isMissing], sets: [setIsMissing]} = useContext(contextStore);
    const messages = isMissing.messages;

    if (!messages || messages.length <= 0) return null;

    const closeAll = () => {
        const id = setTimeout(() => {
            setIsMissing({
                status: false,
                messages: []
            });
        }, 6000);
        return () => clearTimeout(id);
    }

    return (
        <div onAnimationEnd={closeAll} className="fixed z-[100] bottom-0 right-0 flex flex-col flex-wrap gap-1 animate-toast">
            {
                messages.map((message, index) => (
                    <div key={index} className="flex flex-row flex-nowrap flex-1 items-center gap-4
                        bg-slate-950 text-white/80 w-full h-10 px-4 py-2 rounded">
                        <Info className="text-red-800" />
                        <p className="text-sm text-white/80">{message}</p>
                    </div>
                ))
            }
        </div>
    )
}

export function ErrorToast() {

    const {states, sets} = useContext(contextStore);
    const message = states[1].message || null;
    const setError = sets[1];

    if (!message) return null;

    const closeAll = () => {
        const id = setTimeout(() => {
            setError({
                status: false,
                messages: ""
            });
        }, 6000);
        return () => clearTimeout(id);
    }

    return (
        <div onAnimationEnd={closeAll} className="fixed z-[100] bottom-0 right-0 animate-toast">
            <div className="flex flex-row flex-nowrap flex-1 items-center gap-4
                 w-full h-10 px-4 py-2 rounded shadow-lg shadow-slate-950 bg-red-950 text-red-200">
                <Info className="text-red-800" />
                <p className="text-sm text-white/80">{message}</p>
            </div>
        </div>
    )
}

export function SuccessToast() {

    const {states, sets} = useContext(contextStore);
    const message = states[2].message || null;
    const setError = sets[2];

    if (!message) return null;

    const closeAll = () => {
        const id = setTimeout(() => {
            setError({
                status: false,
                messages: ""
            });
        }, 6000);
        return () => clearTimeout(id);
    }

    return (
        <div onAnimationEnd={closeAll} className="fixed z-[100] bottom-0 right-0 animate-toast">
            <div className="flex flex-row flex-nowrap flex-1 items-center gap-4
                 w-full h-10 px-4 py-2 rounded shadow-lg shadow-slate-950 bg-slate-950 text-green-200">
                <CircleCheck className="text-green-800" />
                <p className="text-sm text-white/80">{message}</p>
            </div>
        </div>
    )
}