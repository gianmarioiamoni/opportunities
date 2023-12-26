// ContactDetailsSidebar.jsx
// props:
// visibleContactSidebar
// setVisibleContactSidebar
// contactDetailsId
// isEditable
// setIsEditable
// isAddNewContact
// refreshParent
// clickCompanyButton

import React, { useState, useEffect } from "react";

import { Sidebar } from "primereact/sidebar"

import ContactDetailsBody from "./ContactDetailsBody"

import { removeContact, addContact } from "../services/opportunityService";


export default function ContactDetailsSidebar(props) {
    const [saveTrigger, setSaveTrigger] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [header, setHeader] = useState();

    ////////////
    // sidebars custom header
    //
    const customIcons = (
        <React.Fragment>
            {props.isEditable ? (
                <button className="p-sidebar-icon p-link mr-2" onClick={onClickSave}>
                    <span className="pi pi-save" />
                </button>
            ) : (
                <button className="p-sidebar-icon p-link mr-2" onClick={onClickEdit}>
                    <span className="pi pi-pencil" />
                </button>
            )}
        </React.Fragment>
    );

    const customHeader = (
        <React.Fragment>
            <h2 style={{ marginBottom: 0 }}>{header !== null && header}</h2>
        </React.Fragment>
    );

    ////////////
    // useEffect
    //
    useEffect(() => {
        console.log("useEffect() - isSaved = " + isSaved)
    }, [isSaved]) 
    

    useEffect(() => {
        setHeader(props.header);
        // if (props.isAddNewCompany === true && props.companyDetailsId != null && props.companyDetailsId !== false) {
        //     console.log("======= ADD NEW COMPANY");

        //     addEmptyCompany();

        // }

    // }, [props.isAddNewCompany, props.companyDetailsId]) 
    }, [props.header]) 

    useEffect(() => {
        // setHeader(props.header);
        if (props.isAddNewContact === true && props.contactDetailsId != null && props.contactDetailsId !== false) {
            console.log("======= ADD NEW CONTACT");

            addEmptyContact();

        }

    }, [props.isAddNewContact, props.contactDetailsId]) // eslint-disable-line react-hooks/exhaustive-deps

    async function addEmptyContact() {

        const emptyContact = {
            id: props.contactDetailsId,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "",
            company: "",
            companyId: null,
            confidenceLevel: "",
            notes: ""

        };

        console.log("ContactDetailsSidebar - addEmptyContact() - emptyContact = " + JSON.stringify(emptyContact));

        try {
            addContact(emptyContact);
        } catch (err) {
            console.log("Failed to add empty contact: " + err);
        }
    }


    ////////////
    // edit, save
    //
    function onClickEdit() {
        props.setIsEditable(true);

    } // onClickEdit()


    function onClickSave() {
        // set the save trigger
        setSaveTrigger((t) => t + 1);
        setIsSaved(true);

        // if (props.refreshParent !== null) {
        //     props.refreshParent();
        // }

        props.setIsEditable(false);

    } // onClickSave()

    async function onHide() {
        console.log("^^^^^^ onHide()");
        console.log("^^^^^^ isSaved = " + isSaved);
        console.log("^^^^^^ props.isAddNewContact = " + props.isAddNewContact);
        console.log("^^^^^^ props.contactDetailsId = " + props.contactDetailsId);

        //if not saved and add a new company, clean the added empty company
        if (!isSaved && props.isAddNewContact && props.contactDetailsId != null) {

            // if add new contact, delete the added empty contact
            try {
                await removeContact(props.contactDetailsId);
            }
            catch (error) { console.log("failed to remove contact: " + error); }

            setIsSaved(false);

        }

        props.setVisibleContactSidebar(false);

        if (props.isEditable) {
            props.setIsEditable !== null && props.setIsEditable(false);
        }

        if (props.refreshParent !== null) {
            props.refreshParent();
        }
    }
    
    
    return (

        <Sidebar
            className="p-sidebar-md"
            header={customHeader}
            icons={customIcons}
            visible={props.visibleContactSidebar}
            onHide={onHide}
        >
            <ContactDetailsBody
                contactDetailsId={props.contactDetailsId}
                isEditable={props.isEditable}
                isAddNewContact={props.isAddNewContact}
                clickCompanyButton={props.clickCompanyButton}
                saveTrigger={saveTrigger} 
            />
        </Sidebar>
    )

} // ContactDetailsSidebar()