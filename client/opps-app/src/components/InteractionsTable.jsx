////////////
// InteractionsTable.jsx
//



import React, { useState, useEffect, useRef } from 'react';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import AddInteractionSidebar from './AddInteractionSidebar';

import {
    getOpportunityAllInteractions,
    getInteractionAllContacts,
    getCompanyContacts,
    editInteraction,
    removeInteraction
} from "../services/opportunityService";

import { textEditor, dateEditor, typeEditor, createEditedInteraction } from './exports/editor';

import { dateITStrToUSStr } from './exports/formatLocale';


////////////
// interactions table handling
//
// props:
//      - id (opportunity id) 
//      - types = [{ id: "id", type: "type }, ...]
//      - isEditable 
//      - clickContactButton 
//      - compId
//

export default function InteractionsTable(props) {
    
    const [interactionsData, setInteractionsData] = useState([]);
    const [interactionContacts, setInteractionContacts] = useState([]);

    const [visibleAddInteractionSidebar, setVisibleAddInteractionSidebar] = useState(false);
    // const [componentSize, setComponentSize] = useState({ width: 0, height: 0 });

    const [trigger, setTrigger] = useState(0);

    // edited type value
    const [typeValue, setTypeValue] = useState();

    // edited date value
    const [dateValue, setDateValue] = useState(); // selected interaction date 


    // const contacts for AddInteractionSidebar
    const [contactsAddValue, setContactsAddValue] = useState([]);

    const toast = useRef(null);

    // to calculate table size and dimensionig AddInteractionSidebar accordingly
    const componentRef = useRef(null);

    
    useEffect(() => {

        async function createInteractionsData() {
            setInteractionContacts([]);

            await getOpportunityAllInteractions(props.id)
                .then((ints) => {
                    setInteractionsData([...ints]);

                    // RETURN NEEDED to process the next .then()
                    return ints;
                })
                .then((ints) => {
                    // set interactions contacts to contain id and an array of contacts for each interaction
                    ints.forEach(intObj =>
                        getInteractionAllContacts(intObj.id)
                            .then(contacts => setInteractionContacts((prev) =>
                                ([...prev, { "id": intObj.id, "contacts": [...contacts] }]))
                            )
                            .catch(console.log)

                    ) // forEach()

                    return null;
                })
                .catch(console.log)

        }

        createInteractionsData();

        getCompanyContacts(props.compId)
            .then(contacts => setContactsAddValue([...contacts]))
            .catch(console.log)

        
        

        // // get component size
        // if (componentRef.current) {
        //     const rect = componentRef.current.getBoundingClientRect();
        //     const { width, height } = rect;
        //     setComponentSize({ width, height });
        // }

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (trigger) {
            getOpportunityAllInteractions(props.id)
                .then(ints => setInteractionsData(ints))
                .catch(console.log)

        }
    }, [trigger]) // eslint-disable-line react-hooks/exhaustive-deps

    async function onRowEditComplete(e) {
        let { newData } = e;

        const edInt = createEditedInteraction(newData, props.types);

        try {
            await editInteraction(edInt);
            setTrigger((t) => t + 1);
            //setEditedDate(null);

        }
        catch (error) { console.log(error); }

    } // onRowEditComplete()

    function contactsBodyTemplate(rowData) {

        // array of JS objects containing the contacts of the selected interactions
        const arrayDataItems = interactionContacts.find((s) => s.id === rowData.id);
        if (arrayDataItems == null) {
            console.log("arrayDataItems is null");
        } else {
            // we can access contacts
            // create array of React elements to render
            const arrayDataListItems = arrayDataItems.contacts.map(contact => {

                return (
                <li key={contact.id}>
                    <Button value={contact.id}
                        // label={`${contact.first_name} ${contact.last_name}`}
                        label={`${contact.firstName} ${contact.lastName}`}
                        className="p-button-link"
                        onClick={e => props.clickContactButton(contact.id)}
                    />
                    </li>
                )
            }
            )
            return (
                <div className="contacts-list">
                    <ul style={{ listStyle: 'none', cursor: 'pointer' }}>{arrayDataListItems}</ul>
                </div>
            );
        }

    } // contactsBodyTemplate()

    function onRowEditInit(e) {
        const obj = props.types.find((o) => o.type === e.data.type);
        setTypeValue(obj.id);

        // set opportunity edited date
        const dateUSStr = dateITStrToUSStr(e.data.date);
        setDateValue(new Date(dateUSStr));

    } // onRowEditInit()

    function onClickAdd() {
        toast.current.show({ severity: 'info', summary: 'Add interaction button clicked', life: 3000 });

        setVisibleAddInteractionSidebar(true);

    } // onClickAdd()


    //
    // delete row handling
    //
    const deleteButtonTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                text
                severity="danger"
                aria-label="Delete"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteRow(rowData)}
            />
        );
    };

    const deleteRow = (rowData) => {
        // Handle the delete operation for the selected row
        // You should update the 'data' state to remove the selected row.
        // For example:
        const updatedData = interactionsData.filter(item => item.id !== rowData.id);
        setInteractionsData(updatedData);
        removeInteraction(rowData.id)
            .then()
            .catch(console.log)
        
    };


    return (

        <div className="flex justify-content-center" style={{ alignItems: "center" }} >

            <Toast ref={toast} />

            <AddInteractionSidebar
                className="p-sidebar-md"
                visibleAddInteractionSidebar={visibleAddInteractionSidebar}
                setVisibleAddInteractionSidebar={setVisibleAddInteractionSidebar}
                // sbWidth={componentSize.width}
                // sbHeight={componentSize.height}
                oppId={props.id}
                types={props.types}
                contactsAddValue={contactsAddValue}
                setInteractionsData={setInteractionsData}
                setInteractionContacts={setInteractionContacts}
            />

            <div className="interactions-subtable" ref={componentRef}>
                <div className="flex justify-content-center" style={{ margin: "0 0 15px 0", alignItems: "center" }}>
                    <h3 className="expansion-title" style={{ margin: "auto" }}>Interactions for {props.oppName} </h3>
                    <Button
                        className="add-interaction-button"
                        icon="pi pi-plus"
                        rounded
                        text
                        title="Add a new interaction"
                        data-pr-tooltip="New interaction"
                        onClick={() => onClickAdd()}
                    />
                    <p></p>
                </div>

                <DataTable value={interactionsData}
                    editMode={"row"}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditInit={onRowEditInit}
                    size="small"
                    className="interactions-subtable-area"
                    dataKey="id" >
                    <Column
                        field="id"
                        header="Id"
                        // alignHeader="center"
                        style={{ minWidth: '3rem' }}
                    ></Column>
                    <Column
                        field="date"
                        header="Date"
                        // alignHeader="center"
                        style={{ minWidth: '8rem' }}
                        editor={(options) => dateEditor(options, dateValue, setDateValue)}
                    > </Column>
                    <Column
                        field="description"
                        header="Description"
                        // alignHeader="center"
                        editor={(options) => textEditor(options)}
                    > </Column>
                    <Column
                        header="Contacts"
                        body={contactsBodyTemplate !== null && contactsBodyTemplate}
                        alignHeader="center"
                        style={{ minWidth: '14rem' }}
                    > </Column>
                    <Column
                        field="type"
                        header="Type"
                        // alignHeader="center"
                        style={{ minWidth: '10rem' }}
                        editor={(options) => typeEditor(options, props.types, typeValue, setTypeValue)}
                    > </Column>

                    <Column rowEditor />

                    <Column
                        body={deleteButtonTemplate}
                        style={{ textAlign: 'center', width: '2rem' }}
                    />

                </DataTable>
            </div>
        </div>

    );

} // InteractionsTable()

