export function percentDifference(a, b){
    return +(((b - a) / Math.abs(a)) * 100).toFixed(2);
}

export function capitalize(str){
    return str.charAt(0).toUpperCase() + str.substr(1)
}