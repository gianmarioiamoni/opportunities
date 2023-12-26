// ContactDetailsBody.jsx
// props:
//      - companyDetailsId
//      - isEditable

import React, { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";

import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { baseURL, getAllCompanies, editContact } from '../services/opportunityService';


export default function ContactDetailsBody(props) {
    const [contact, setContact] = useState([]);
    const [editedContact, setEditedContact] = useState({});
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const op = useRef(null);

    useEffect(() => {

        fetch(baseURL + `/contacts/${props.contactDetailsId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log("useEffect() - res = " + JSON.stringify(res));
                console.log("res[0].id = " + res[0].id);

                setContact([...res]);
                setEditedContact({ ...res[0] });

                return res;
            })
            .catch((error) => console.log(error))

    }, [props.contactDetailsId, props.isAddNewContact]);

    // useEffect if editable
    useEffect(() => {
        if (props.isEditable) {
            getCompanies();
        }

    }, [props.isEditable])

    async function getCompanies() {
        try {
            const companies = await getAllCompanies();
            setCompanyList([...companies]);
        } catch (err) {
            console.log("failed to get companies list: " + err);
        }
    }

    ////////////
    // Save trigger
    //
    // trigger save
    useEffect(() => {
        if (props.saveTrigger > 0 && editedContact !== null) {
            setContact([{ ...editedContact }]);

            saveContact();

            console.log("Save contact - edit - editedContact = " + JSON.stringify(editedContact));
            console.log("Save contact - edit - contact = " + JSON.stringify(contact));
        }

    }, [props.saveTrigger, editedContact]); // eslint-disable-line react-hooks/exhaustive-deps

    async function saveContact() {
        try {
            console.log("========= saveContact()");

            await editContact(editedContact);
            ////
            // setEditedContact(null);
            ////
        }
        catch (err) {
            console.log("Failed to save contact: " + err);
        }
    }

    ////////////
    // Company list table
    //
    const buttonsCompaniesTemplate = (rowData) => {
        return (
            <div className="flex justify-content-flex-end">
                <Button
                    icon="pi pi-plus"
                    text
                    severity="info"
                    aria-label="View"
                    className="p-button-rounded p-button-info"
                    data-pr-tooltip="Add company to contact"
                    onClick={() => addCompanyToContact(rowData)}
                />
            </div>

        );
    } // buttonsCompaniesTemplate()


    function addCompanyToContact(rowData) {
        setEditedContact((prev) => ({ ...prev, companyId: rowData.id, company: rowData.name }));

    } // addCompanyToContact()


    ////////////
    // add company to contact if not assigned
    //
    const companySelect = (e) => {
        op.current.hide();
        
        // assign selected company to contact
        const newContact = [...contact];
        newContact[0].company = e.data.name;
        newContact[0].companyId = e.data.id;
        setContact([...newContact]);

        // add selected company to db
        editContactWithNewCompany(newContact[0]);

    };


    function onClickSelectCompanyBtn(e) {
        console.log("select company");

        getCompanies();

        // show company select dialog
        op.current.toggle(e);
        
    }

    async function editContactWithNewCompany(contact) {
        try {
            await editContact(contact);
        }
        catch (err) {
            console.log("Failed to save contact: " + err);
        }
    }


    return (
        <div className="contact-details contact-body">

            {props.isEditable ? (
                <div className="flex justify-contenct-between">
                    <div className="flex-auto company-details company-title">
                        <label htmlFor="first-name" className="font-bold block mb-2">First Name</label>
                        <InputText id="first-name" value={editedContact.firstName} style={{ color: "#e25e3e" }} onChange={(e) => setEditedContact({ ...editedContact, firstName: e.target.value })} />
                    </div>
                    <div className="flex-auto company-details company-title">
                        <label htmlFor="last-name" className="font-bold block mb-2">Last Name</label>
                        <InputText id="last-name" value={editedContact.lastName} style={{ color: "#e25e3e" }} onChange={(e) => setEditedContact({ ...editedContact, lastName: e.target.value })} />
                    </div>
                </div>
            ) : (
                <div className="contact-details contact-title">
                    <h3> {contact.length > 0 && contact[0].firstName} {contact.length > 0 && contact[0].lastName}</h3>
                </div>
            )}

            <div className="contact-details contact-job">
                {props.isEditable ? (
                    <div className="flex-auto company-details contact-role">
                        <label htmlFor="role" className="font-bold block mb-2">Role</label>
                        <InputText id="role" value={editedContact.role} onChange={(e) => setEditedContact({ ...editedContact, role: e.target.value })} />
                    </div>
                ) : (
                    <p>{contact.length > 0 && contact[0].role}</p>
                )}
                {props.isEditable ? (
                    <div className="flex justify-content-between align-items-start">
                        <h3>{editedContact.company}</h3>
                        <DataTable
                            value={companyList}
                            header="Select a company"
                            size="small"
                        >
                            <Column field="id" header="Id" />
                            <Column
                                field="name"
                                header="Name"
                            />
                            <Column
                                field="sector"
                                header="Sector"
                            />
                            <Column
                                body={buttonsCompaniesTemplate}
                                style={{ textAlign: 'center', width: '1rem' }}
                            />

                        </DataTable>

                    </div>
                ) : (
                        <div>
                            {contact.length > 0 && contact[0] !== null && contact[0].company == null ? (

                                <div className="card flex flex-column align-items-start gap-3" style={{margin: "3px 0"}}>
                                    <Button type="button" label="Select a company" onClick={onClickSelectCompanyBtn} />
                                    <OverlayPanel ref={op} showCloseIcon dismissable={false}>
                                        <DataTable value={companyList} selectionMode="single" paginator rows={5} selection={selectedCompany} onSelectionChange={(e) => setSelectedCompany(e.value)} onRowClick={companySelect}>
                                            <Column field="id" header="Id" />
                                            <Column field="name" header="Company" sortable style={{ minWidth: '12rem' }} />
                                            <Column field="VAT" header="VAT" />
                                            <Column field="sector" header="Sector" sortable style={{ minWidth: '8rem' }} />
                                        </DataTable>
                                    </OverlayPanel>
                                </div>
                        ) : (

                            <Button
                                label={contact.length > 0 && `${contact[0].company}`}
                                className="p-button-link"
                                onClick={e => {
                                    props.clickCompanyButton(contact[0].companyId);
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="contact-details contact-contacts">
                {props.isEditable ? (
                    <div className="company-details contact-email">
                        {/* <h4 className="company-details email-title">email:</h4> */}
                        <div className="flex-auto">
                            <label htmlFor="email" className="font-bold block mb-2">Email</label>
                            <InputText id="email" value={editedContact.email} onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })} />
                        </div>
                    </div>
                ) : (
                    <p>
                        <FaEnvelope size="15" className="nav-linker nav-icon" />
                        <Button
                            label={contact.length > 0 && `${contact[0].email}`}
                            className="p-button-link"
                            onClick={e => {
                                const ref = contact.length > 0 && `mailto:${contact[0].email}`;
                                console.log("ref = " + ref);
                                window.location.href = ref;
                            }}
                        />
                    </p>
                )}
                <div className="nav-linker">
                    {props.isEditable ? (
                        <div className="flex-auto">
                            <label htmlFor="phone" className="font-bold block mb-2">Phone</label>
                            <InputText id="phone" value={editedContact.phone} onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })} />
                        </div>
                    ) : (
                        <div className="flex-auto">
                            <FaPhoneAlt size="15" className="nav-linker nav-icon" />
                            <Button
                                label={contact.length > 0 && `${contact[0].phone}`}
                                className="p-button-link"
                                onClick={e => {
                                    const ref = contact.length > 0 && `tel:${contact[0].phone}`;
                                    window.location.href = ref;
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="nav-linker">
                    <FaWhatsapp size="15" className="nav-linker nav-icon" />
                    <Button
                        label="WhatsApp"
                        className="p-button-link"
                        onClick={e => {
                            const number = contact.length > 0 && `tel:${contact[0].phone}`;
                            const ref = contact.length > 0 && `whatsapp://send?text=hello&phone=${number}`
                            window.location.href = ref;

                        }}
                    />
                </div>
            </div>

            <div className="contact-details confidence-level">
                {props.isEditable ? (
                    <div className="flex-auto">
                        <label htmlFor="confidence" className="font-bold block mb-2">Confidence level</label>
                        <InputText id="confidence" value={editedContact.confidenceLevel} onChange={(e) => setEditedContact({ ...editedContact, confidenceLevel: e.target.value })} />
                    </div>
                ) : (
                    <div className="flex-auto">
                        <h4 className="confidence-level-title">Confidence level: </h4>
                        <span>{contact.length > 0 && contact[0].confidenceLevel}</span>
                    </div>
                )}
            </div>

            <div className="col-12 md:col-8 contact-details notes">
                {props.isEditable ? (
                    <div className="flex-auto">
                        <label htmlFor="notes" className="font-bold block mb-2">Notes</label>
                        <textarea
                            id="notes"
                            value={editedContact.notes !== null ? editedContact.notes : ""}
                            rows="5"
                            style={{ minWidth: "80%", margin: "5px, 0" }}
                            onChange={(e) => setEditedContact({ ...editedContact, notes: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="flex-auto">
                        <h4 className="notes-title">Notes:</h4>
                        <ScrollPanel style={{ width: '100%', height: '300px' }} className="custombar1">
                            <div style={{ padding: '1em', lineHeight: '1.5' }}>
                                {contact.length > 0 && contact[0].notes}
                            </div>
                        </ScrollPanel>
                    </div>
                )}
            </div>

        </div>
    )

} // ContactDetailsBody()

/* <Button
                                label="select a company"
                                className="p-button-link"
                                onClick={() => selectCompany()}
                            /> */
