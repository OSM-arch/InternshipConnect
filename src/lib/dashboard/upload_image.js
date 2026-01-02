export default async function uploadImage(user_id, role, user_img) {

    const formData = new FormData();

    formData.append("id", user_id);
    formData.append("role", role);
    formData.append('file', user_img);

    try {
        const res = await fetch("/api/upload/avatar", {
            method: "POST",
            body: formData
        });

        return await res.json();

    }catch (err) {
        console.error(err.message);
    }
}