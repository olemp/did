export function getHash() {
    return document.location.hash ? decodeURIComponent(document.location.hash.substring(1)) : null;
}