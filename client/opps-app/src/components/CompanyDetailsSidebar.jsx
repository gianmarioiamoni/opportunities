// CompanyDetailsSidebar.jsx
// props:
//      - companyDetailsId
//      - visibleCompanySidebar
//      - setVisibleCompanySidebar()
//      - header
//      - isEditable
//      - setIsEditable()
//      - isAddNewCompany: null | true
//      - setIsAddNewCompany()
//      - refreshParent()
//      

import React, { useState, useEffect } from "react";

import { Sidebar } from "primereact/sidebar"

import CompanyDetailsBody from "./CompanyDetailsBody"

import { addCompany, removeCompany, removeAddress, getCompanyAddresses } from "../services/opportunityService";


export default function CompanyDetailsSidebar(props) {
    const [header, setHeader] = useState();
    const [saveTrigger, setSaveTrigger] = useState(0);
    const [isSaved, setIsSaved] = useState(false);


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


    useEffect(() => {
        setHeader(props.header);
        if (props.isAddNewCompany === true && props.companyDetailsId != null && props.companyDetailsId !== false) {
            console.log("======= ADD NEW COMPANY");

            addEmptyCompany();

        } 

    }, [props.isAddNewCompany, props.companyDetailsId]) // eslint-disable-line react-hooks/exhaustive-deps

    async function addEmptyCompany() {

        const emptyCompany = {
            id: props.companyDetailsId,
            name: "",
            VAT: "",
            employees: 0,
            revenues: 0,
            sectorId: 1

        };

        console.log("CompanyDetailsSidebar - addEmptyCompany() - emptyCompany = " + JSON.stringify(emptyCompany));

        
        try {
            addCompany(emptyCompany);
        } catch (err) {
            console.log("Failed to add empty company: " + err);
        }
    }

    ////////////
    // edit, save, hide
    //
    function onClickEdit() {
        props.setIsEditable(true);

    } // onClickEdit()


    function onClickSave() {
        // set the save trigger
        setSaveTrigger((t) => t + 1); 
        setIsSaved(true);

        props.setIsEditable(false);

    } // onClickSave()

    async function onHide() {

        // if not saved and add a new company, clean the added empty company
        if (!isSaved && props.isAddNewCompany && props.companyDetailsId != null) {
            //remove addresses related to added empty company
            getCompanyAddresses(props.companyDetailsId)
                .then(adds => {
                    console.log("onHide() - getCompanyAddresses() - adds = " + JSON.stringify(adds));
                    adds.map(address => removeAddress(address.id));
                    return adds;
                })
                .catch((err) => console.log(err))
            
            // if add new company, delete the added empty company and references in companies_has_addresses
            try {
            await removeCompany(props.companyDetailsId);

            }
            catch (error) { console.log(error); } 

            setIsSaved(false);

        }

        props.setVisibleCompanySidebar(false);

        if (props.refreshParent !== null) {
            props.refreshParent();
        }

    }

    ////////////
    // rendering
    //
    return (

        <Sidebar
            className="p-sidebar-lg"
            header={customHeader}
            icons={customIcons}
            visible={props.visibleCompanySidebar}
            onHide={onHide}>

            <CompanyDetailsBody
                companyDetailsId={props.companyDetailsId}
                isEditable={props.isEditable}
                isAddNewCompany={props.isAddNewCompany}
                saveTrigger={saveTrigger} />

        </Sidebar>
    )

} // CompanyDetailsSidebar()