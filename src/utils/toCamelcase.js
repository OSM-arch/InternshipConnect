export default function toCamelcase(word) {
    if (!word) return;
    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}