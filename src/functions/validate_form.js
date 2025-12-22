export default function validateForm(labels, array, setState) {
    const messages = [];

    array.map((value, index) => {
       if (!value) {
           messages.push(`${labels[index]} is missing!`);
       }
    });

    if (messages.length > 0) {
        setState({
            status: true,
            messages: messages
        });
        return false;
    }

    return true;
}