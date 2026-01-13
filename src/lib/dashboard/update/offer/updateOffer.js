export const updateOffer = {
    add: async (object) => {
        try {
            const res = await fetch(`/api/offers/post-offer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(object)
            });
            const data = await res.json();
            return !!data.success;
        }catch (err) {
            console.error(err);
        }
    },
    update: async (formData) => {
        try {
            const offer_id = formData.get("offer_id");
            const res = await fetch(`/api/offers/my-offers/update`, {
                method: "PATCH",
                body: formData
            });
            return await res.json();
        }catch (err) {
            console.error(err);
        }
    },
    open: async (offer_id) => {
        try {
            const res = await fetch(`/api/offers/my-offers/open/${offer_id}`, {method: "PATCH"});
            return await res.json();
        }catch (err) {
            console.error("Error While Opening Offer: ", err);
        }
    },
    close: async (offer_id) => {
        try {
            const res = await fetch(`/api/offers/my-offers/close/${offer_id}`, {method: "PATCH"});
            return await res.json();
        }catch (err) {
            console.error("Error While Closing Offer: ", err);
        }
    },
    delete: async (offer_id) => {
        try {
            const res = await fetch(`/api/offers/my-offers/delete/${offer_id}`, {method: "DELETE"});
            return await res.json();
        }catch (err) {
            console.error("Error While Deleting Offer: ", err);
        }
    }
}