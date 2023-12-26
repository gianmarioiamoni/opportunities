//
// body and filter templates
//

import React from 'react';

import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import { formatCurrency } from './formatLocale'


export function getSeverity(status) {
    switch (status) {
        case 'NEW':
            return 'success';

        case 'NEGOTIATION':
            return 'warning';

        case 'LOST':
            return 'danger';

        case "WON":
            return 'info';

        default:
            return 'primary';
    }

} // getSeverity()

//
// Date templates
// 

export function dateBodyTemplate(rowData) {
    return rowData.date;

}; // dateBodyTemplate()

export function dateFilterTemplate(options) {
    return <Calendar
        value={options.value}
        style={{ minWidth: '8rem' }}
        onChange={(e) => {
            const d = new Date(e.value);
            options.filterCallback(d, options.index);
        }}
        // locale="it-IT"
        dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />;
    
} // dateFilterTemplate()


//
// Value templates
//

export function valueBodyTemplate(rowData) {
    return formatCurrency(rowData.value);

} // valueBodyTemplate()

export function valueFilterTemplate(options) {
    return <InputNumber value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency" currency="EUR" locale="it-IT" />;
    
} // valueFilterTemplate()


//
// Status templates
//

export function statusBodyTemplate(rowData) {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;

} // statusBodytemplate()

export function statusFilterTemplate(options) {
    return <Dropdown value={options} options={options}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One" className="p-column-filter" showClear />;
    
} // statusFilterTemplate()

export function statusItemTemplate(option) {
    return <Tag value={option.status} severity={getSeverity(option.status)} />;

} // statusItemTemplate()



