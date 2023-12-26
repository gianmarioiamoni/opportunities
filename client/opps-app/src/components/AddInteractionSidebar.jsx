import React, {useState, useEffect, useRef} from "react";

import { Sidebar } from "primereact/sidebar"
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
// import { Tooltip } from 'primereact/tooltip';

import ItemList from "./ItemList";

import { addInteraction, addContactsToInteraction } from "../services/opportunityService";

import { dateITStrToUSStr } from "./exports/formatLocale";

import { typeEditorItemTemplate } from "./exports/editor";

import { getTypeByKey } from "./exports/common";

// import CompanyDetailsBody from "./CompanyDetailsBody"

// 
// initialise date 
//
const today = new Date();
today.setHours(0, 0, 0, 0);

const todayFormatted = today.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

////////////
// AddInteractionSidebar.jsx
//
// props:
//      - visibleAddInteractionSidebar
//      - setVisibleAddInteractionSidebar
//      - sbWidth (NOT USED)
//      - oppId 
//      - types = [{ id: "id", type: "type" }, ...]
//      - contactsAddValue // list of contacts to choose from 
//      - setInteractionsData
//      - setInteractionContacts = ({ "id": intId, "contacts": ["id": contId, "first_name": first_name, "last_name": lastName] }, ...]
//

export default function AddInteractionSidebar(props) {

    const customIcons = (
        <React.Fragment>
            <button className="p-sidebar-icon p-link mr-2" onClick={() => onClickSave()}>
                <span className="pi pi-save" />
            </button>
        </React.Fragment>
    );

    const customHeader = (
        <h2>Add Interaction</h2>
    );

    const toast = useRef(null);

    // const [maxId, setMaxId] = useState();

    const [dateValue, setDateValue] = useState();
    const [descriptionValue, setDescriptionValue] = useState();
    const [typeValue, setTypeValue] = useState();
    const [contactsValue, setContactsValue] = useState([]); // contacts of the new interactions
    const [contactsListByCompany, setContactsListByCompany] = useState([]); // list of contacts to choose from
    
    // 
    // contacts selection handling
    // 
    const [availableItems, setAvailableItems] = useState([...contactsListByCompany.filter(item => !contactsValue.includes(item))]);

    let newInteractionId = null;

    //
    // add contacts handling
    //
    const [selectedAddContact, setSelectedAddContact] = useState(null);

    const op = useRef(null);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current && selectedAddContact) {
            op.current.hide();
            toast.current.show({
                severity: 'info', summary: 'Contact Selected', detail: `${selectedAddContact.firstName} ${selectedAddContact.lastName}`, life: 3000 });
        }
    }, [selectedAddContact]);

    useEffect(() => {
        isMounted.current = true;

        setContactsValue([]);
        setAvailableItems([]);

    }, []);

    useEffect(() => {

        // initialize date
        const dateUSStr = dateITStrToUSStr(todayFormatted);
        setDateValue(new Date(dateUSStr));

        // initialize type
        setTypeValue(1);

        // initialize description
        setDescriptionValue("");

        // initialize contactsValue [{id: "id", name: "first_name last_name"}, ...]
        setContactsListByCompany(props.contactsAddValue !== null && [...props.contactsAddValue]);
       
        // initialize lisy of available contacts for the interaction
        setAvailableItems(props.contactsAddValue !== null && [...props.contactsAddValue]);

        setContactsValue([]);
        setAvailableItems([]);

    }, [props.contactsAddValue]) // eslint-disable-line react-hooks/exhaustive-deps


    function onClickSave() {
        toast.current.show({ severity: 'info', summary: 'Save new Interaction', life: 3000 });

        createNewInteraction();

        setContactsValue([]);
        setAvailableItems([]);
        setSelectedAddContact({});

        setDescriptionValue("");

        props.setVisibleAddInteractionSidebar(false)
    
    } // onClickSave()


    function onClickAddContact(e) {
        toast.current.show({ severity: 'info', summary: 'Add contact button clicked', life: 3000 });

        // update available contacts list
        setAvailableItems([...contactsListByCompany.filter(item => !contactsValue.includes(item))]);

        op.current.toggle(e);

    } // onClickAddContact()


    // selected contact handler
    const onAddContactSelect = (e) => {
        setSelectedAddContact(e.value);
        setContactsValue(prev => [...prev, e.value]);

        setAvailableItems([...contactsListByCompany.filter(item => !contactsValue.includes(item))]);

    }; // onAddContactSelect()


    // create the new Interaction object and send It to the server
    async function createNewInteraction() {

        dateValue.setHours(0, 0, 0, 0);
        const dateFormatted = dateValue.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        let newInteraction = {
            // id: maxId,
            date: dateFormatted,
            description: descriptionValue,
            type: typeValue,
            opportunity: props.oppId !== null && props.oppId

        };

        // send to server
        await addInteraction(newInteraction)
            .then(res => {

                // get the typeValue label
                const tVal = getTypeByKey(props.types, typeValue);
                newInteraction = { id: res.insertId, ...newInteraction, type: tVal !== null && tVal };
                // update hook for interactionTable with the new interaction
                props.setInteractionsData(prev => [...prev, newInteraction]);
                newInteractionId = res.insertId;
                return newInteraction;
            })
            .catch(console.log);
        
        const newContactsList = contactsValue.map(contactItem => (
            {
                contactsId: contactItem.id,
                interactionsId: newInteractionId !== null && newInteractionId
            }));
        
        // add contacts to the db
        addContactsToInteraction(newContactsList, newInteractionId)
            .then(res => {
                props.setInteractionContacts(prev => ([...prev, { "id": newInteractionId, "contacts": [...contactsValue] }]));
            })
            .catch(console.log);
        
    } // createNewInteraction()


    return (

        <div>

            <Toast ref={toast} />

            <Sidebar
                visible={props.visibleAddInteractionSidebar}
                className="p-sidebar-lg"
                position="bottom"
                header={customHeader}
                icons={customIcons}
                onHide={() => props.setVisibleAddInteractionSidebar(false)}
                // style={{width: props.sbWidth}}
                style={{ width: "60%" }}
            >
                <h2>Add Interaction</h2>

                {/* <h3>Id = {maxId !== null && maxId}</h3> */}
                <div className="flex justify-content-between">
                    
                    <div className="add-date-field field col-6 md:col-6">
                        <h4 className="date-title add-date-title">Date</h4>
                        <Calendar
                            id="date"
                            value={dateValue != null && dateValue}
                            onChange={(e) => setDateValue((prev) => (prev = e.value))}
                            showIcon dateFormat="dd/mm/yy"
                            placeholder="dd/mm/yyyy"
                            mask="99/99/9999"
                            style={{ margin: "5px 0", width: "50%" }}
                        />
                    </div>

                    <div className="add-type-field field col-6 md:col-6">
                        <h4 className="add-title add-title-title">Type</h4>
                        <Dropdown
                            value={typeValue}
                            options={props.types}
                            optionLabel="type"
                            optionValue="id"
                            onChange={(e) => setTypeValue((prev) => (prev = e.value))}
                            placeholder="Select a type"
                            itemTemplate={typeEditorItemTemplate}
                            style={{ margin: "5px 0", wodth: "50%" }}

                        />
                    </div>

                </div>

                <div className="add-description-field field col-12 md:col-12">
                    <h4 className="show-title add-description-title">Description</h4>
                    <textarea
                        value={descriptionValue}
                        rows="5"
                        style={{ minWidth: "80%", margin: "5px, 0" }}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        placeholder="Type a description"
                    />
                </div>

                <div className="add-contacts-field field col-13 md:col-12">
                   
                    <ItemList
                        header={"Contacts"}
                        items={contactsValue}
                        setItems={setContactsValue}
                    />

                    <div className="card flex flex-column align-items-center gap-3">
                        {/* <Tooltip target=".add-contact-button" content="Click to add a contact" position="right" visible={true} /> */}
                        <Button
                            className="add-contact-button"
                            icon="pi pi-plus"
                            label="Add a contact"
                            // rounded
                            // text
                            //title="Add a contact"
                            // data-pr-tooltip="Add a contact"
                            // data-pr-position="right"
                            // data-pr-at="right+5 top"
                            // data-pr-my="left center-2"
                            onClick={(e) => onClickAddContact(e)}
                        />

                        <OverlayPanel ref={op} showCloseIcon dismissable={false}>
                            <DataTable
                                // value={contactsListByCompany} selectionMode="single"
                                // CONTACTS
                                value={availableItems} selectionMode="single"
                                onSelectionChange={e => onAddContactSelect(e)}>
                                <Column field="id" header="Id" style={{ minWidth: '3rem' }} />
                                <Column field="firstName" header="First Name" sortable />
                                <Column field="lastName" header="last Name" sortable />
                                <Column field="role" header="Job Title" sortable />
                            </DataTable>
                        </OverlayPanel>

                    </div>

                </div>

            </Sidebar>
        </div>
    )

} // AddInteractionSidebar()