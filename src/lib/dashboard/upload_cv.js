export default async function uploadCV(user_id, role, cv) {

    const formData = new FormData();

    formData.append("id", user_id);
    formData.append("role", role);
    formData.append('file', cv);

    try {
        const res = await fetch("/api/upload/cv", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (err) {
        console.error(err.message);
    }
}