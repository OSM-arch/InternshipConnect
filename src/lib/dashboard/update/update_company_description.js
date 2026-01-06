export default async function updateCompanyDescription(user_id, description) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('description', description);

        const res = await fetch("/api/update/company_description", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}