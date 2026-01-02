export default function toCamelcase(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}