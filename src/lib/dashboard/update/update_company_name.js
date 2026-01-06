export default async function updateCompanyName(user_id, company_name) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('company_name', company_name);

        const res = await fetch("/api/update/company_name", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}