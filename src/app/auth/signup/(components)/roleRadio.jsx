export default function RoleRadio({ setRole }) {

    const roles = ["Student", "Company", "Supervisor", "School"];

    return (
        <div className="mb-4">
            <label className="block text-blue-200 text-sm font-semibold mb-4 ml-1">Select Role</label>
            <div className="flex p-1 bg-blue-950/70 rounded-full border-0">

                {
                    roles.map((role, index) => (
                        <label key={index} className="flex-1 relative cursor-pointer group">
                            <input onChange={(e) => setRole(e.currentTarget.value)}
                                   className="peer sr-only" name="role" type="radio" value={role} />
                            <div className="flex items-center justify-center py-2 px-4 rounded-full text-sm
                            font-medium text-slate-500 transition-all duration-200 peer-checked:bg-blue-950/90
                            peer-checked:text-blue-200 peer-checked:shadow-sm"
                            >
                                {role}
                            </div>
                        </label>
                    ))
                }
            </div>
        </div>
    )
}