export default function Success({text}) {
    return (<div id="alert-2"
                 className="flex sm:items-center p-4 mb-4 text-sm text-green-800 rounded-base bg-green-900/40
                  animate-fadeIn" role="alert">
        <svg className="w-4 h-4 shrink-0 mt-0.5 md:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="ms-2 font-medium">
            {text}
        </div>
    </div>)
}