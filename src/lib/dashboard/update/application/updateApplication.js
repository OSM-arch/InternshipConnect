export const updateApplication = {
    accept: async (application_id) => {
        try {
            const formData = new FormData();
            formData.append("status", "accepted");
            const res = await fetch(`/api/applications/update/${application_id}`, {
                method: "PATCH",
                body: formData
            });
            return await res.json();
        }catch (err) {
            console.error(err);
        }
    },
    reject: async (application_id) => {
        try {
            const formData = new FormData();
            formData.append("status", "rejected");
            const res = await fetch(`/api/applications/update/${application_id}`, {
                method: "PATCH",
                body: formData
            });
            return await res.json();
        }catch (err) {
            console.error(err);
        }
    }
}