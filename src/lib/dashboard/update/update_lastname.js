export default async function updateLastName(user_id, lastname) {
    try {

        const formData = new FormData();
        formData.append('id', user_id);
        formData.append('lastname', lastname);

        const res = await fetch("/api/update/lastname", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (error) {
        console.error(error);
    }
}