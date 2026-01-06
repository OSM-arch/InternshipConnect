export default async function updateCompanyAddress(user_id, address) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('address', address);

        const res = await fetch("/api/update/company_address", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}