export function getCurrentDate(){
    let currentDate = new Date();
    return currentDate.toISOString();
}

export function formatDate(dateToFormat){
    let date = new Date(dateToFormat);
    date.setSeconds(date.getSeconds() + 1); 
    return date.toISOString();
}