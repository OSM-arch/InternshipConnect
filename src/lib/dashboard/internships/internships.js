export const internships = {
    get: async (user_id) => {
        const res = await fetch(`/api/internships/${user_id}`);
        return await res.json();
    },
    update: {
        endDate: async (internship_id, end_date) => {
            const res = await fetch(`/api/internships/update/end_date`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({internship_id, end_date})
            });
            return await res.json();
        },
        assignedSupervisor: async (internship_id, supervisor_id) => {
            const res = await fetch(`/api/internships/update/assignedSupervisor`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({internship_id, supervisor_id})
            });
            return await res.json();
        }
    }
}