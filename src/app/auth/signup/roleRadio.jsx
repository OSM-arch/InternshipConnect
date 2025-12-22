export default function RoleRadio({ setRole }) {

    return (
        <div>
            <label className="block text-slate-700 text-sm font-semibold mb-3 ml-1">Select Role</label>
            <div className="flex p-1 bg-green-950/40 backdrop-blur-md rounded-full border-0">
                <label className="flex-1 relative cursor-pointer group">
                    <input onChange={(e) => setRole(e.currentTarget.value)}
                           className="peer sr-only" name="role" type="radio" value="student"/>
                    <div className="flex items-center justify-center py-2 px-4 rounded-full text-sm
                        font-medium text-slate-500 transition-all duration-200 peer-checked:bg-white
                        peer-checked:text-slate-900 peer-checked:shadow-sm">
                        Student
                    </div>
                </label>
                <label className="flex-1 relative cursor-pointer group">
                    <input onChange={(e) => setRole(e.currentTarget.value)}
                           className="peer sr-only" name="role" type="radio" value="company"/>
                    <div className="flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium
                        text-slate-500 transition-all duration-200 peer-checked:bg-white
                        peer-checked:text-slate-900 peer-checked:shadow-sm">
                        Company
                    </div>
                </label>
                <label className="flex-1 relative cursor-pointer group">
                    <input onChange={(e) => setRole(e.currentTarget.value)}
                           className="peer sr-only" name="role" type="radio" value="supervisor"/>
                    <div className="flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium
                        text-slate-500 transition-all duration-200 peer-checked:bg-white
                        peer-checked:text-slate-900 peer-checked:shadow-sm">
                        Supervisor
                    </div>
                </label>
            </div>
        </div>
    )
}