export default async function updateFirstName(user_id, firstname) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('firstname', firstname);

        const res = await fetch("/api/update/firstname", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}