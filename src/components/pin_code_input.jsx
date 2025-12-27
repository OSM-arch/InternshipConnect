import {useRef} from "react";

export default function PinCodeInput({ setCode }) {
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");

        e.target.value = value;
        setCode(prev => prev += value);

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {

        if (e.key === "Backspace" && index > 0) {
            setCode("");
        }

        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        setCode(e.clipboardData.getData("text"));
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        digits.split("").forEach((digit, index) => {
            if (inputsRef.current[index]) {
                inputsRef.current[index].value = digit;
            }
        });

        const nextIndex = Math.min(digits.length, 5);
        inputsRef.current[nextIndex]?.focus();
    };

    return (
        <div className="max-w-sm mx-auto">
            <div className="flex justify-self-center mb-2 space-x-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength={1}
                        className="block text-center text-lg bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs"
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        inputMode="numeric"
                        required
                    />
                ))}
            </div>

            <p className="mt-2.5 text-sm text-body">
                Please introduce the 6 digit code we sent via email.
            </p>
        </div>
    );
}