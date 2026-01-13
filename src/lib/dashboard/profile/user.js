export const getProfileForUser = {
    student: async (user_id) => {
        const res = await fetch(`/api/dashboard/student/profile/${user_id}`);
        return await res.json();
    },
    company: async (user_id) => {
        const res = await fetch(`/api/dashboard/company/profile/${user_id}`);
        return await res.json();
    }
}