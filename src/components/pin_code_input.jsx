export default function PinCodeInput() {
    return (
        <>
            <form className="max-w-sm mx-auto">
                <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
                    <div>
                        <label htmlFor="code-1" className="sr-only">First code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-next="code-2"
                               id="code-1"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                    <div>
                        <label htmlFor="code-2" className="sr-only">Second code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-prev="code-1"
                               data-focus-input-next="code-3" id="code-2"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                    <div>
                        <label htmlFor="code-3" className="sr-only">Third code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-prev="code-2"
                               data-focus-input-next="code-4" id="code-3"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                    <div>
                        <label htmlFor="code-4" className="sr-only">Fourth code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-prev="code-3"
                               data-focus-input-next="code-5" id="code-4"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                    <div>
                        <label htmlFor="code-5" className="sr-only">Fifth code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-prev="code-4"
                               data-focus-input-next="code-6" id="code-5"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                    <div>
                        <label htmlFor="code-6" className="sr-only">Sixth code</label>
                        <input type="text" maxLength="1" data-focus-input-init data-focus-input-prev="code-5"
                               id="code-6"
                               className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body"
                               required/>
                    </div>
                </div>
                <p id="helper-text-explanation" className="mt-2.5 text-sm text-body">Please introduce the 6 digit code
                    we sent via email.</p>
            </form>
        </>
    )
}