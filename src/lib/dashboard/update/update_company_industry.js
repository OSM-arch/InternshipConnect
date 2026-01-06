export default async function updateCompanyIndustry(user_id, industry_id) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('industry_id', industry_id);

        const res = await fetch("/api/update/industry_id", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}