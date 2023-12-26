// 
// format date and currency
//

import { isEmpty } from "./common";

// return a date in it-IT locale format
export function createFormattedDate(date) {
    //
    // date format
    //

    // const date = newData.date;

    let dateFormatted = null;

    if (typeof (date) === 'string') {
        dateFormatted = date;
    } else {

        dateFormatted = formatDate(date);
    }

    return dateFormatted;

} // createFormattedDate()

// convert a date in it-IT locale
export const formatDate = (value) => {

    value.setHours(0, 0, 0, 0);

    const d1 = value.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return d1;

}; // formatDate()

// takes a currency object and convert it in it-IT locale object
export const formatCurrency = (value) => {
    return value.toLocaleString('it-IT',
        {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    
}; // formatCurrency()

// takes a date string with "-" separators and returns a dd/mm/yyyy string
export function toDateStrITFormat(dateStr) {
    console.log("***toDateStrITFormat()");

    if (! isEmpty(dateStr)) {
        const [year, month, dayTime] = dateStr.split("-");
        console.log("after split()");
        console.log(`year = ${year}, month = ${month}, dayTime = ${dayTime}`);

        // get the day from day+time part
        const day = dayTime.substring(0, 2);
        console.log("day = " + day);

        // const [day2, month2, year2] = dateFormat("/")
        const dateType = new Date(year, month - 1, day);
        // adding 1 day if it is a string
        dateType.setDate(dateType.getDate() + 1);

        // convert back to string in it-IT format
        dateType.setHours(0, 0, 0, 0);
        const dateStrFormat = dateType.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        console.log("dateStrFormat = " + dateStrFormat)

        return dateStrFormat;
    } else {
        return "";
    }

} // toDateStrITFormat()


// takes a date string in IT locale format and returns a date object in US locale format
export function toDateUSFormat(dateStr) {

    if (!isEmpty(dateStr)) {
        const [day, month, year] = dateStr.split("/");

        const dateObj = new Date(year, month - 1, day);

        dateObj.setHours(0, 0, 0, 0);

        return dateObj;
    } 
    
}

export function dateITStrToUSStr(dateITStr) {
    const [day, month, year] = dateITStr.split("/");

    const dateUSStr = `${month}/${day}/${year}`;

    return dateUSStr;

}