// ClientDatabaseBody.jsx
// props:
//      - database: "companies" | "contacts"
//      - header
//

import React, {useState, useEffect, useRef, useMemo} from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

import { createClientDatabaseDownloadItems } from "./exports/download";

import {
    getAllCompanies, getMaxCompaniesId, removeCompany, getCompanyOpportunities,
    getAllContacts, getMaxContactsId, removeContact, getContactInteractions
} from "../services/opportunityService";

import CompanyDetailsSidebar from "./CompanyDetailsSidebar";
import ContactDetailsSidebar from "./ContactDetailsSidebar";



export default function ClientDatabaseBody(props) {

    const [values, setValues] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // left side bar vsibility for contacts detailed information
    const [visibleContactSidebar, setVisibleContactSidebar] = useState(false);
    // const [contactDetailsId, setContactDetailsId] = useState();

    // left side bar vsibility for companies detailed information
    const [visibleCompanySidebar, setVisibleCompanySidebar] = useState(false);
    const [itemDetailsId, setItemDetailsId] = useState();

    // edit mode
    const [isEditable, setIsEditable] = useState(false);

    // add new item
    const [isAddNewCompanyItem, setIsAddNewCompanyItem] = useState()
    const [isAddNewContactItem, setIsAddNewContactItem] = useState()


    // refresh contacts list
    const [refreshContactsList, setRefreshContactsList] = useState(false);
    
    const toast = useRef(null);

    // refresh trigger
    // const [trigger, setTrigger] = useState(0);

    useEffect(() => {

        if (props.database === "companies") {
            getAllCompanies()
                .then(companiesList => setValues([...companiesList]))
                .catch(console.log)
                    
        } else if (props.database === "contacts" || refreshContactsList) {
            getAllContacts()
                .then(contactsList => {
                    setValues([...contactsList]);
                    if (refreshContactsList) {
                        setRefreshContactsList(false);
                    }
                    return;
                })
            .catch(err => console.log(err))
        }
    }, [props.database, refreshContactsList]); // useEffect()
    

    async function refreshBody() {
        if (props.database === "contacts") {
            try {
                await getAllContacts()
                    .then(contactsList => setValues([...contactsList]))
                    .catch(console.log)
            } catch (err) {
                console.log("failed to refresh contacts: " + err);
            }

        } else if (props.database === "companies") {
            try {
                await getAllCompanies()
                    .then(companiesList => setValues([...companiesList]))
                    .catch(console.log)
            } catch (err) {
                console.log("failed to refresh companies: " + err);
            }
        }
    } // refreshBody()


    let columns = useMemo(() => {
        return values.length > 0 ? Object.keys(values[0]) : [];
    }, [values]);

    // in case of "contacts" database, remove the extra companyId from columns
    if (props.database === "contacts") {
        const filteredColumns = columns.filter(column => column !== "companyId");
        columns = [...filteredColumns];
    }


    //
    // header 
    //
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center" style={{ borderRadius: "25%", margin: "10px 0" }}>
                <h3 style={{ margin: "auto" }}>{props.header}</h3>
                <span className="p-input-icon-left" style={{ margin: "auto" }}>
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        value={globalFilterValue}
                        onChange={(e) => setGlobalFilterValue(e.target.value)}
                        placeholder="Global Search"
                        style={{ borderRadius: "3rem" }}
                    />
                    <Button
                        icon="pi pi-plus"
                        text
                        // severity="info"
                        aria-label="Add"
                        // className="p-button-rounded p-button-info"
                        className="p-button-rounded"
                        data-pr-tooltip="Add a new item"
                        onClick={() => addNewRow()}
                    />
                </span>
            </div>
        );
    }; // renderHeader()

    const header = renderHeader();


    //////////
    // download menu
    //
    const dt = useRef(null);
    const downloadMenu = useRef(null);
    const downloadItems = createClientDatabaseDownloadItems(dt, values, columns, props.database);


    ////////////
    // paginator
    //
    function onClickDownload(event) {
        downloadMenu.current.toggle(event);
    }

    const paginatorLeft = <Divider layout="vertical" style={{margin: "0", padding: "0", border: "0"}} />;
    const paginatorRight =
        <div className="download-menu">
            <Menu model={downloadItems} popup ref={downloadMenu} id="popup_menu" data-pr-tooltip="Download" />
            <Button id="download-btn" type="button" icon="pi pi-download" text title="Download"
                onClick={onClickDownload}
                aria-controls="popup_menu" aria-haspopup />
        </div>
        ;
    
    
    ////////////
    // view, edit, delete, add 
    //
    const buttonsTemplate = (rowData) => {
        return (
            <div className="flex justify-content-flex-end">
                <Button
                    icon="pi pi-eye"
                    text
                    severity="info"
                    aria-label="View"
                    className="p-button-rounded p-button-info"
                    onClick={() => viewRow(rowData)}
                />
                <Button
                    icon="pi pi-pencil"
                    text
                    severity="warning"
                    aria-label="Edit"
                    className="p-button-rounded p-button-warning"
                    onClick={() => editRow(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    aria-label="Delete"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteRow(rowData)}
                />
            </div>
            
        );
    }

    async function deleteRow(rowData) {
        // Handle the delete operation for the selected row
        if (props.database === "companies") {
            // remove company from database

            // check if there are opportunities for the company
            try {
                const oppsNum = await getCompanyOpportunities(rowData.id)
                if (oppsNum[0].oppsNum > 0) {
                    toast.current.show({ severity: 'info', summary: 'Impossible to delete company', detail: `There are opportunities associated with the company`, life: 3000 });
                    return;
                }
            } catch (err) {
                console.log("Impossible to get opportunities number")
            }
            removeCompany(rowData.id)
                .then(() => {
                    // update the 'data' state to remove the selected row.
                    const updatedData = values.filter(item => item.id !== rowData.id);
                    setValues(updatedData);

                    // remove contacts of deleted company
                    // done in the db rules
                    
                    // refresh contacts body
                    setRefreshContactsList(true);
                    refreshBody();
                })
                .catch(err => console.log(err))
        } else if (props.database === "contacts") {

            // check if there are interactions associated with the contact
            try {
                const intsNum = await getContactInteractions(rowData.id)
                if (intsNum[0].intsNum > 0) {
                    toast.current.show({ severity: 'info', summary: 'Impossible to delete contact', detail: `There are interactions associated with the contact`, life: 3000 });
                    return;
                }
            } catch (err) {
                console.log("Impossible to get interactions number")
            }

            // no interactions associated with the contact: remove it
            removeContact(rowData.id)
                .then(() => {
                    // update the 'data' state to remove the selected row.
                    const updatedData = values.filter(item => item.id !== rowData.id);
                    setValues(updatedData);

                    // remove contacts of deleted company
                    // done in the db rules

                    // refresh contacts body
                    // setRefreshContactsList(true);
                    refreshBody();
                })
                .catch(err => console.log(err))
            
        }

    }; // deleteRow()

    function editRow(rowData) {
        setIsEditable(true);

        // setIsAddNewItem(false);
        
        setItemDetailsId(rowData.id);

        if (props.database === "companies") {
            setIsAddNewCompanyItem(false);
            // setItemDetailsId(rowData.id);
            setVisibleCompanySidebar(true);
        } else if (props.database === "contacts") {
            // setItemDetailsId(rowData.id);
            setIsAddNewContactItem(false);
            setVisibleContactSidebar(true);
        }

    } // editRow()

    function viewRow(rowData) {
        setIsEditable(false);
        
        setItemDetailsId(rowData.id);

        if (props.database === "contacts") {
            // setItemDetailsId(rowData.id);
            setIsAddNewContactItem(false);
            setVisibleContactSidebar(true);
        } else if (props.database === "companies") {
            setIsAddNewCompanyItem(false);
            // setItemDetailsId(rowData.id);
            setVisibleCompanySidebar(true);
        }

    } // viewRow()

    ////////////
    // add new item
    //
    async function addNewRow() {

        // setIsAddNewItem(true);

        if (props.database === "contacts") {
            console.log("add new contact");
            setIsAddNewContactItem(true);
            setIsEditable(true);
            // calculate new contact id
            await getMaxContactsId()
                .then(maxId => {
                    setItemDetailsId(maxId[0].maxId + 1);
                })
                .catch(console.log)
            
            // show contactDetailsSidebar
            setVisibleContactSidebar(true);

        } else if (props.database === "companies") {
            setIsAddNewCompanyItem(true);
            setIsEditable(true);
            // calculate new company Id
            await getMaxCompaniesId()
                .then(maxId => {
                    setItemDetailsId(maxId[0].maxId + 1);
                })
                .catch(console.log)

            // show companyDetailsSidebar
            setVisibleCompanySidebar(true);
        }

    } // addNewRow()


    ////////////
    // contact and company details sidebar
    //
    function clickCompanyButton(companyId) {
        if (companyId === null) {
            // no company is assigned to the contact

            return;
        } 
            
        // setIsAddNewItem(false);
        setIsAddNewCompanyItem(false);
        setIsAddNewContactItem(false);
        setItemDetailsId(companyId);
        setVisibleCompanySidebar(true);

    } // clickCompanyButton()


    return (

        <div className="client-database-container" style={{ width: "100%" }}>
            
            <Toast ref={toast} />

            <ContactDetailsSidebar
                className="p-sidebar-md"
                visibleContactSidebar={visibleContactSidebar}
                setVisibleContactSidebar={setVisibleContactSidebar}
                contactDetailsId={itemDetailsId !== null && itemDetailsId}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                isAddNewContact={isAddNewContactItem}
                refreshParent={refreshBody}
                clickCompanyButton={clickCompanyButton}
            />

            <CompanyDetailsSidebar
                className="p-sidebar-md"
                visibleCompanySidebar={visibleCompanySidebar}
                setVisibleCompanySidebar={setVisibleCompanySidebar}
                companyDetailsId={itemDetailsId !== null && itemDetailsId}
                header={"Company details"}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                isAddNewCompany={isAddNewCompanyItem}
                refreshParent={refreshBody}
            />

            <DataTable
                value={values}
                header={header}

                scrollable
                scrollHeight="30rem"

                globalFilter={globalFilterValue}
                paginator rows={10} rowsPerPageOptions={[10, 20, 30, 50]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}

                ref={dt}

                size="small"

                style={{ width: "95%" }}
            >
                {columns.map((column, index) => (
                    <Column key={index} field={column} header={column} />
                ))}

                <Column
                    body={buttonsTemplate}
                    style={{ textAlign: 'center', width: '1rem' }}
                />

            </DataTable>

        </div>

    );

}