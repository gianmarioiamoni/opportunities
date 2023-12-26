// CompanyDetailsBody.jsx
// props:
//      - companyDetailsId
//      - isEditable
//      - isAddNewCompany
//      - setIsAddNewCompany()
//      - saveTrigger
//

import React, { useState, useEffect, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

import { textEditor } from "./exports/editor";

import {
    baseURL,
    getAllSectors, addSector, editSector, getSectorCompanies, removeSector,
    getCompanyAddresses, editCompany
} from "../services/opportunityService";

import { isEmpty } from "./exports/common";

import CompanyAddressesList from "./CompanyAddressesList";
import AddressSelector from "./AddressSelector";

export default function CompanyDetailsBody(props) {

    const [company, setCompany] = useState([]);
    const [editedCompany, setEditedCompany] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [newSector, setNewSector] = useState();
    const [isNewSectorButtonDisabled, setNewSectorButtonDisabled] = useState(true);
    const [deletedSectorId, setDeletedSectorId] = useState();
    const [isSelectAddressVisible, setIsSelectAddressVisible] = useState(false);

    // confirmation dialog for delete
    const confirmDeleteSector = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: `Do you want to delete ${rowData.sector} sector?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });

    }; // confirmDeleteSector()


    const informDeleteSector = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: `It's not possible to delete ${rowData.sector} sector \n There are companies associated with It.`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-info',
        });

    }; // informDeleteSector()

    const toast = useRef(null);

    useEffect(() => {
        // if (props.isAddNewCompany) {
        //     // adding a new company

        //     console.log("******** useEffect() - isAddNewCompany");

        //     const emptyCompany = {
        //         name: "",
        //         VAT: "",
        //         revenues: "",
        //         employees: "",
        //         sector: ""
        //     };

        //     setCompany([{ ...emptyCompany }]);

        //     setIsSelectAddressVisible(true);

        // } else {
        //     // fetch company data
        //     fetch(baseURL + `/companies/${props.companyDetailsId}`, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //         }
        //     })
        //         .then(res => res.json())
        //         .then(res => {
        //             setCompany([...res]);
        //             setEditedCompany({ ...res[0] });

        //             getCompanyAddresses(props.companyDetailsId)
        //                 .then(adds => (setAddresses([...adds])))
        //                 .catch((err) => console.log(err))

        //             return res;
        //         })
        //         .catch((error) => console.log(error))
        // }

            // fetch company data
            fetch(baseURL + `/companies/${props.companyDetailsId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(res => res.json())
                .then(res => {
                    setCompany([...res]);
                    setEditedCompany({ ...res[0] });
                    
                    // if is editing an existing company, get addresses
                    if (!props.isAddNewCompany) {
                        getCompanyAddresses(props.companyDetailsId)
                        .then(adds => (setAddresses([...adds])))
                        .catch((err) => console.log(err))
                    } else {
                        // set address selector visible if add a new company
                        setIsSelectAddressVisible(true);
                    }

                    return res;
                })
                .catch((error) => console.log(error))
        
        
        
        // fetch sectors data
        getAllSectors()
            .then(sectorsList => setSectors(sectorsList))
            .catch((error) => console.log(error))
        
    }, [props.companyDetailsId, props.isAddNewCompany]); // eslint-disable-line react-hooks/exhaustive-deps


    // trigger save
    useEffect(() => {
        if (props.saveTrigger > 0 && editedCompany !== null) {
            setCompany([{ ...editedCompany }]);

            saveCompany();

            console.log("Save company - edit - editedCompany = " + JSON.stringify(editedCompany));
            console.log("Save company - edit - company = " + JSON.stringify(company));
        }

    }, [props.saveTrigger, editedCompany]); // eslint-disable-line react-hooks/exhaustive-deps

    async function saveCompany() {
        try {
            console.log("========= saveCompany()");

            await editCompany(editedCompany);
            ////
            // setEditedCompany(null);
            ////
        }
        catch (err) {
            console.log("Failed to save company: " + err);
        }
    }


    ////////////
    // add, edit, delete sector and addresses
    //
    function addSectorToCompany(rowData) {
        setEditedCompany((prev) => ({ ...prev, sectorId: rowData.id, sector: rowData.sector }));

    } // addSectorToCompany()


    function deleteSectorRow(event, rowData) {
        getSectorCompanies(rowData.id)
            .then((sectorCompaniesArray) => {
                if (sectorCompaniesArray.length === 0) {
                    // no companies with the sector 
                    setDeletedSectorId(rowData.id);
                    confirmDeleteSector(event, rowData);
                } else {
                    // companies are associated to the sector
                    informDeleteSector(event, rowData);

                }
            })

    } // deleteSectorRow


    function deleteAddressRow(event, rowData) {
        // update addresses object
        const filteredAddresses = addresses.filter((address) => address.id !== rowData.id);
        setAddresses([...filteredAddresses]);

    } // deleteAddressRow()


    const accept = () => {
        
        removeSector(deletedSectorId)
            .then(() => {
                toast.current.show({ severity: 'info', summary: 'Confirmed', detail: `You have deleted sector with id = ${deletedSectorId}`, life: 3000 });
                // update sectors
                const filteredSectors = sectors.filter((sector) => sector.id !== deletedSectorId);
                setSectors(...filteredSectors);
                return deletedSectorId;
            })
            .catch(console.log)
        
    } // accept()


    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });

    }; // reject()


    const buttonsSectorsTemplate = (rowData) => {
        return (
            <div className="flex justify-content-flex-end">
                <Button
                    icon="pi pi-plus"
                    text
                    severity="info"
                    aria-label="View"
                    className="p-button-rounded p-button-info"
                    data-pr-tooltip="Add sector to company"
                    onClick={() => addSectorToCompany(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    aria-label="Delete"
                    className="p-button-rounded p-button-danger"
                    data-pr-tooltip="Delete sector"
                    onClick={(e) => deleteSectorRow(e, rowData)}
                />
            </div>

        );
    } // buttonsSectorsTemplate()


    const buttonsAddressesTemplate = (rowData) => {
        return (
            <div className="flex justify-content-flex-end">
                <Button
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    aria-label="Delete"
                    className="p-button-rounded p-button-danger"
                    data-pr-tooltip="Delete sector"
                    onClick={(e) => deleteAddressRow(e, rowData)}
                />
            </div>

        );
    } // buttonsAddressesTemplate()


    function onNewSectorInputChange(e) {
        setNewSector(e.target.value);

        // Disable the button if the input is empty
        setNewSectorButtonDisabled(e.target.value === ''); 

    } // onNewSectorInputChange

    
    async function onClickAddSector() {

        await addSector( { sector: newSector } )
            .then(res => {

                const newSectorObj = { id: res.insertId, sector: newSector };
               
                // update hook for the new sector
                setSectors(prev => [...prev, newSectorObj]);
                return newSectorObj;
            })
            .catch(console.log);

    } // onClickAddSector


    async function onSectorsRowEditComplete(e) {
        let { newData } = e;

        const updatedSectors = [...sectors];
        const rowIndex = sectors.findIndex((row) => row.id === newData.id);
        updatedSectors[rowIndex] = { "id": newData.id, "sector": newData.sector };
        setSectors(updatedSectors);

        // send to the db
        try {
            await editSector(newData);
            // setTrigger((t) => t + 1);
        }
        catch (error) { console.log(error); }


    } // onSectorsRowEditComplete()


    function onAddressesRowEditComplete(e) {
        let { newData } = e;

        const updatedAddresses = [...addresses];
        const rowIndex = addresses.findIndex((row) => row.id === newData.id);

        updatedAddresses[rowIndex].description = newData.description; 

        // send to DB
        setAddresses([...updatedAddresses]);

    } // onAddressesRowEditComplete()


    function onAddCompanyAddress() {
        setIsSelectAddressVisible(true);

    } // onAddCompanyAddress()

    //
    // Addresses table header
    //
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h3 className = "addresses-table-header p-datatable-header">Addresses</h3>
                <Button type="button" icon="pi pi-plus" label="Add an address" outlined onClick={onAddCompanyAddress} />
                
            </div>
        );

    }; // renderheader()

    const header = renderHeader();
   

    return (
        
        <div className="company-details company-body">
            
            <Toast ref={toast} />
            <ConfirmPopup />

            {props.isEditable ? (
                <div className="company-details company-title">
                    <h4 className="company-details name-title">Name:</h4>
                    <InputText value={editedCompany?.name} style={{ color: "#e25e3e" }} onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })} />
                </div>
            ) : (
                <div className="company-details company-title">
                        <h2 className="company-details name.title" style={{ color: "#e25e3e"}}>{company.length > 0 && company[0]?.name}</h2>
                </div>
            )}
            
            <div className="company-details company-info">
                <h4 className="company-details VAT-title">VAT code:</h4>
                {props.isEditable ? (
                    <InputText value={editedCompany?.VAT} onChange={(e) => setEditedCompany({ ...editedCompany, VAT: e.target.value })} />
                ) : (
                    <span className="company-details VAT">{company.length > 0 && company[0]?.VAT}</span>
                )}

                <h4 className="company-details revenues-title">Revenues [MEur]:</h4>
                {props.isEditable ? (
                    <InputNumber
                        inputId="locale-italian"
                        value={editedCompany?.revenues}
                        onValueChange={(e) => setEditedCompany({ ...editedCompany, revenues: e.value })}
                        mode="decimal"
                        locale="it-IT" />
                ) : (
                    <span className="company-details revenues">{company.length > 0 && company[0]?.revenues}</span>
                )}

                <h4 className="company-details employees-title">Employees:</h4>
                {props.isEditable ? (
                    <InputNumber value={editedCompany?.employees} onValueChange={(e) => setEditedCompany({ ...editedCompany, employees: e.target.value }) } locale="it-IT" />
                ) : (
                    <span className="company-details employees">{company.length > 0 && company[0]?.employees}</span>
                )}
            </div>

            <div className="company-details sector">
                <h4 className="company-details sector-title">Sector:</h4>
                {props.isEditable ? (
                    <div className="flex justify-content-between align-items-start">
                        <span className="company-details sector">{editedCompany?.sector}</span>
                        <DataTable
                            value={sectors}
                            header="Choose a sector"
                            size="small"
                            editMode="row"
                            onRowEditComplete={onSectorsRowEditComplete}
                        >
                            <Column field="id" header="Id" />
                            <Column
                                field="sector"
                                header="Sector"
                                editor={(options) => textEditor(options)}
                            />
                            <Column
                                body={buttonsSectorsTemplate}
                                style={{ textAlign: 'center', width: '1rem' }}
                            />

                            <Column rowEditor />
                        </DataTable>

                        <div className="flex flex-column add-sector-container">
                            <InputText value={newSector} placeholder="Type a new sector" onChange={onNewSectorInputChange} />
                            <Button label="Add new sector" icon="pi pi-plus" disabled={isNewSectorButtonDisabled} onClick={onClickAddSector} />
                        </div>
                    </div>
                ) : (
                    <span className="company-details sector">{company.length > 0 && company[0]?.sector}</span>
                )}

            </div>

            {props.isEditable ? (

                <div className="company-details-addresses">
                    {isSelectAddressVisible && window.google && window.google.maps ? (
                        <AddressSelector
                            setIsVisible={setIsSelectAddressVisible}
                            addresses={addresses}
                            setAddresses={setAddresses}
                            companyId={props.companyDetailsId}
                        /> 
                    ) : (
                        <div>
                            <p>Google Maps script has not loaded. Please check your API key and internet connection.</p>
                        </div>
                    )}
                    {addresses == null || isEmpty(addresses) ? (
                        <div></div>
                    ) : (
                            
                        <DataTable
                            value={addresses}
                            header={header}
                            size="small"
                            editMode="row"
                            onRowEditComplete={onAddressesRowEditComplete}
                        >
                            <Column field="id" header="Id" />
                            <Column field="description" header="Description" editor={(options) => textEditor(options)} />
                            <Column field="fullAddress" header="Address" /> 
                        
                            <Column
                                body={buttonsAddressesTemplate}
                                style={{ textAlign: 'center', width: '1rem' }}
                            />

                            <Column rowEditor />
                        </DataTable>
                    )}
                </div>
                
            ) : (
                    <CompanyAddressesList addresses={addresses} />
            )} 

        </div>
    )
}