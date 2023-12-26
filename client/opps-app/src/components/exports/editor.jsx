import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

import { Tag } from 'primereact/tag';

import { getSeverity } from './templates';
// import { formatDate } from './formatLocale';

import { createFormattedDate } from './formatLocale';

// import AddressSelector from '../AddressSelector';

//
// Status editor
//
function onChangeStatus(e, setStatusValue, options) {
    setStatusValue((prev) => (prev = e.value));
    options.editorCallback(e.value);
}
export function statusEditor(options, statuses, statusValue, setStatusValue) {
    return (
        <Dropdown value={statusValue} options={statuses} optionLabel="status" optionValue="id"
            onChange={(e) => onChangeStatus(e, setStatusValue, options)}
            valueTemplate={statusEditorValueTemplate}
            itemTemplate={statusEditorItemTemplate} />

    );

} // statusEditor()

export const statusEditorItemTemplate = (option) => {
    return <Tag severity={getSeverity(option.status)}>{option.status}</Tag>

} // statusEditorItemtemplate()

export const statusEditorValueTemplate = (option) => {
    if (option) {
        return <Tag severity={getSeverity(option.status)}>{option.status}</Tag>
    }

} // statusEditorItemtemplate()


//
// Type editor
//
function onChangeType(e, setTypeValue, options) {
    setTypeValue((prev) => (prev = e.value));
    options.editorCallback(e.value);

} // onChangeType()

export function typeEditor(options, types, typeValue, setTypeValue) {
    return (
        <Dropdown value={typeValue !== null && typeValue} options={types} optionLabel="type" optionValue="id"
            onChange={(e) => onChangeType(e, setTypeValue, options)}
            itemTemplate={typeEditorItemTemplate} />
    );

} // typeEditor()

export const typeEditorItemTemplate = (option) => {
    return <span >{option.type}</span>

} // typeEditorItemTemplate()


//
// Date editor
//
function onChangeDate(e, setDateValue, options) {
    setDateValue((prev) => (prev = e.value));
    options.editorCallback(e.value);
}

export function dateEditor(options, dateValue, setDateValue) {

    return (
        <Calendar id="date" value={dateValue != null && dateValue}
            onChange={(e) => onChangeDate(e, setDateValue, options)}
            showIcon dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            mask="99/99/9999" />
    );

} // dateEditor()


//
// Text editor
//
export function textEditor(options) {
    return <InputText id="input-text" type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;

} // textEditor()

//
// Address editor
//
// export function addressEditor(options) {
//     return <AddressSelector initAddress={options.value} />

// } // addressEditor()


//
// Company editor
//
export function companyEditor(options, companies) {
    return (
        <Dropdown value={options.value} options={companies} optionLabel="name" optionValue="id"
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Company"
            itemTemplate={companyEditorItemTemplate} />
    );

} // companyEditor()

const companyEditorItemTemplate = (option) => {

    return <span >{option.name}</span>

} // companyEditorItemTemplate()


//
// Value editor
//
export function valueEditor(options) {

    return <InputNumber
        id="input-number"
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.target.value)}
        mode="currency" currency="EUR" locale="it-IT" />;

} // valueEditor()


// // return a date in it-IT locale format
// function createFormattedDate(date) {
//     //
//     // date format
//     //

//     // const date = newData.date;

//     let dateFormatted = null;

//     if (typeof (date) === 'string') {
//         dateFormatted = date;
//     } else {

//         dateFormatted = formatDate(date);
//     }

//     return dateFormatted;

// } // createFormattedDate()


//
// returns the edited opportunity
//
export function createEditedOpportunity(newData, statuses, companies) {
    
    //
    // set id for Dropdown in case no new selection
    //
    let statusKey = 0;

    if (typeof (newData.status) === 'string') {
        const searchObject = statuses.find((s) => s.status === newData.status);
        statusKey = searchObject.id;

    } else {
        statusKey = newData.status;
    }

    let companyKey = 0;

    if (typeof (newData.company) === 'string') {
        const searchObject = companies.find((c) => c.name === newData.company);
        companyKey = searchObject.id;

    } else {
        companyKey = newData.company;
    }

    //
    // date format
    //

    const dateFormatted = createFormattedDate(newData.date);

    // create edited opportunity object
    const edOpp = {
        id: newData.id,
        name: newData.name,
        company: companyKey,
        date: dateFormatted,
        value: newData.value,
        status: statusKey
    };

    return edOpp;

} // createEditedOpportunity()

//
// returns the edited interaction
//
export function createEditedInteraction(newData, types) {

    console.log("**** createEditedInteraction()");
    console.log("**** types = " + JSON.stringify(types));

    //
    // set id for Dropdown in case no new selection
    //
    let typeKey = 0;

    if (types !== null) {
        if (typeof (newData.type) === 'string') {
            const searchObject = types.find((s) => s.type === newData.type);
            typeKey = searchObject.id;

        } else {
            typeKey = newData.type;
        }
   

        //
        // date format
        //

        const dateFormatted = createFormattedDate(newData.date);

        // create edited interaction object
        const edInt = {
            id: newData.id,
            description: newData.description,
            date: dateFormatted,
            type: typeKey
        };

        return edInt;
    }

} // createEditedOpportunity()