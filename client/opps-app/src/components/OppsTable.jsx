import React, { useState, useRef, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';

import 'primeicons/primeicons.css';

import AddOpportunityDialog from "./AddOpportunityDialog";
import ShowOpportunityDialog from "./ShowOpportunityDialog"
import CompanyDetailsSidebar from './CompanyDetailsSidebar';
import ContactDetailsSidebar from './ContactDetailsSidebar'; 
import InteractionsTable from './InteractionsTable';

import {
    add, edit, remove, getAll,
    getAllCompanies, getAllStatuses,
    getAllTypes
} from '../services/opportunityService';

import {
    dateFilterTemplate,
    valueBodyTemplate,
    valueFilterTemplate,
    statusBodyTemplate,
    statusFilterTemplate
} from './exports/templates'

import { dateITStrToUSStr } from './exports/formatLocale';

import { textEditor, statusEditor, dateEditor, valueEditor, createEditedOpportunity } from './exports/editor';

import { createDownloadItems } from './exports/download';


export default function OppsTable(props) {

    const [opportunities, setOpportunities] = useState([]);

    // rows expansion
    const [expandedRows, setExpandedRows] = useState(null);
    const [expandedRowData, setExpandedRowData] = useState([]);
    // const [interactionContacts, setInteractionContacts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    // edited values
    const [statusValue, setStatusValue] = useState(); // selected status
    const [dateValue, setDateValue] = useState(); // selected date 

    // left side bar visibility for contacts detailed information
    const [visibleContactSidebar, setVisibleContactSidebar] = useState(false);
    const [contactDetailsId, setContactDetailsId] = useState();

    // left side bar visibility for companies detailed information
    const [visibleCompanySidebar, setVisibleCompanySidebar] = useState(false);
    const [companyDetailsId, setCompanyDetailsId] = useState();
    const [isCompanyDetailsSidebarEditable, setIsCompanyDetailsSidebarEditable] = useState(false);

    //
    // manage buttons activation if a row is selected
    //
    const [isBtnDisabled, setIsBtnDisabled] = useState(true);

    const [selectedRowId, setSelectedRowId] = useState(null);

    // dialogs visibility
    const [visible, setVisible] = useState(false); // delete confirm dialog
    const [isAddVisible, setIsAddVisible] = useState(false); //  add opportunity dialog
    const [isShowVisible, setIsShowVisible] = useState(false); // show opportunity dialog

    // trigger for calling a function in child element from parent element
    const [trigger, setTrigger] = useState(0);
    const [addTrigger, setAddTrigger] = useState(0);
    const [showTrigger, setShowTrigger] = useState(0);



    //
    // table size
    //
    const [sizeOptions] = useState([
        { label: 'Small', value: 'small' },
        { label: 'Normal', value: 'normal' },
        { label: 'Large', value: 'large' }
    ]);
    const [size, setSize] = useState(sizeOptions[1].value);


    //////////
    // download menu
    //

    const dt = useRef(null);
    const downloadMenu = useRef(null);
    const downloadItems = createDownloadItems(dt, opportunities, expandedRowData);


    ////////////
    // paginator
    //

    function refreshOppsTable() {
        setTrigger((t) => t + 1); 
    }

    function onClickRefresh() {
        toast.current.show({ severity: 'info', summary: 'Refresh clicked', life: 3000 });
        refreshOppsTable();
    }

    function onClickDownload(event) {
        downloadMenu.current.toggle(event);
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text title="Refresh" onClick={onClickRefresh} data-pr-tooltip="Refresh" />;
    const paginatorRight =
        <div className="download-menu">
            <Menu model={downloadItems} popup ref={downloadMenu} id="popup_menu" data-pr-tooltip="Download" />
            <Button id="download-btn" type="button" icon="pi pi-download" text title="Download"
                onClick={onClickDownload}
                aria-controls="popup_menu" aria-haspopup />
        </div>
        ;


    ////////////
    // data for companies and statuses
    //

    //const [statuses] = useState(['NEW', 'FIRST PRESENTATION', 'SCOPE IDENTIFIED', 'OFFER PRESENTED', 'REVIEW', 'NEGOTIATION', 'LOST', 'WON']);
    const [statuses, setStatuses] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [types, setTypes] = useState([]);


    ////////////
    // loading at refresh
    //
    useEffect(() => {
        getAll()
            .then(opps => setOpportunities(opps))
            .catch(console.log)

        getAllStatuses()
            .then(statusesList => setStatuses(statusesList))
            .catch(console.log)

        getAllCompanies()
            .then(companiesList => setCompanies(companiesList))
            .catch(console.log)
        
        getAllTypes()
            .then(typesList => setTypes(typesList))
            .catch(console.log)

        initFilters();

        setLoading(false);

    }, []);

    useEffect(() => {
        if (trigger) {
            getAll()
                .then(opps => setOpportunities(opps))
                .catch(console.log)

        }
    }, [trigger]);


    ////////////
    // filtering
    //

    const [filters, setFilters] = useState({});

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            value: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }

        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Global Search" 
                        style={{borderRadius: "3rem"}}
                        />

                </span>
            </div>
        );
    };


    const toast = useRef(null);


    ////////////
    // rows quick editing
    //

    function onRowEditInit(e) {
        const obj = statuses.find((o) => o.status === e.data.status);
        setStatusValue(obj.id);

        // set opportunity edited date
        const dateUSStr = dateITStrToUSStr(e.data.date);
        setDateValue(new Date(dateUSStr));

    } // onRowEditInit()
    
    async function onRowEditComplete(e) {
        let { newData } = e;

        const edOpp = createEditedOpportunity(newData, statuses, companies);

        try {
            await edit(edOpp);
            setTrigger((t) => t + 1);
            //setEditedDate(null);

        }
        catch (error) { console.log(error); }


    } // onRowEditComplete()


    ////////////
    // rows expansion handling
    //

    function onRowExpand(event) {

        // close current expanded row and set as expanded only current one
        setExpandedRows({ [event.data.id]: true });

        // // set company id related to the expanded opportunity
        // setCompanyAddId(event.data.company_id);

        toast.current.show({ severity: 'info', summary: 'Opportunity Expanded', detail: event.data.name, life: 3000 });

    } // onRowExpand()


    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Opportunity Collapsed', detail: event.data.name, life: 3000 });
        setExpandedRowData([]);

        setExpandedRows({ [event.data.id]: false });
        setExpandedRows(null);

    } // onRowCollapse()


    const allowExpansion = (rowData) => {
        // search for the opportunity with id = rowId
        const searchObject = opportunities.find((s) => s.id === rowData.id)
        return searchObject.interactionsNumber > 0;

    }; // allowExpansion()

    function clickContactButton(contactId) {
        toast.current.show({ severity: 'info', summary: 'Contact clicked', detail: `clicked on contact with id: ${contactId}`, life: 3000 });

        setContactDetailsId(contactId);
        setVisibleContactSidebar(true);

    } // clickContactButton()

    function clickCompanyButton(companyId) {
        toast.current.show({ severity: 'info', summary: 'Company clicked', detail: `clicked on company with id: ${companyId}`, life: 3000 });

        setCompanyDetailsId(companyId);
        setVisibleCompanySidebar(true);

    } // clickCompanyButton()


    function companyBodyTemplate(rowData) {
        return (
            <Button
                value={rowData.companyId}
                label={`${rowData.company}`}
                className="p-button-link company-details-link"
                onClick={e => clickCompanyButton(rowData.companyId)}
            />
        )
    } // companyBodyTemplate()


    const rowExpansionTemplate = (data) => {

        return (
            <InteractionsTable
                oppName={data.name}
                id={data.id}
                types={types}
                isEditable={true}
                clickContactButton={clickContactButton} 
                compId={data.companyId}
                />
        );

    } // rowExpansionTemplate()


    //////////
    // button set handling
    //

    function onClickAdd() {
        toast.current.show({ severity: 'info', summary: 'Add clicked', life: 3000 });
        setIsAddVisible(true);
        setAddTrigger((addTrigger) => addTrigger + 1);

    } // onClickAdd()


    function onClickShow() {
        toast.current.show({ severity: 'info', summary: 'Show clicked', detail: `Show opportunity id=${selectedRowId}`, life: 3000 });
        setIsShowVisible(true);
        setShowTrigger((showTrigger) => showTrigger + 1);

    } //onClickShow()

    // function onClickEdit() {
    //     toast.current.show({ severity: 'info', summary: 'Edit clicked', life: 3000 });

    // } // onClickEdit()

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        onAcceptDelete();

    } // accept()

    async function onAcceptDelete() {
        console.log("onAcceptDelete()");
        if (!selectedRowId) {
            return;
        }

        try {
            await remove(selectedRowId);
            setTrigger((trigger) => trigger + 1);
            setIsBtnDisabled(true);

        }
        catch (error) { console.log(error); }

    } // onAcceptDelete()


    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });

    } // reject()


    function onClickDelete() {
        console.log("onClickDelete()");
        setVisible(true);

    } // onClickDelete()

    const message = `Do you want to delete the opportunity with id = ${selectedRowId} ?`;


    ////////////
    // row selection handling
    //

    function onRowSelect(event) {
        setIsBtnDisabled(false);
        setSelectedRowId(event.data.id);
        toast.current.show({ severity: 'info', summary: 'row selected', detail: `Id: ${event.data.id}`, life: 3000 });

    } // onRowselect()

    function onRowUnselect(event) {
        setIsBtnDisabled(true);
        setSelectedRowId(null);
        toast.current.show({ severity: 'info', summary: 'row unselected', detail: `Id: ${event.data.id}`, life: 3000 });

    } // onRowUnselect()

    


    ////////////
    // Add opportunity
    //
    async function addOpportunity(newOpp) {

        try {
            await add(newOpp);
            setTrigger(prevTrigger => prevTrigger + 1);
        }
        catch (error) { console.log(error); }

    } // addOpportunity()


    ////////////
    // rendering
    //

    const header = renderHeader();

    return (
        <div className="data-table flex justify-content-center mb-16" >
            <div className="card">

                <Toast ref={toast} />

                <ContactDetailsSidebar
                    className="p-sidebar-md"
                    visibleContactSidebar={visibleContactSidebar}
                    setVisibleContactSidebar={setVisibleContactSidebar}
                    contactDetailsId={contactDetailsId}
                    clickCompanyButton={clickCompanyButton}
                />

                <CompanyDetailsSidebar
                    className="p-sidebar-md"
                    visibleCompanySidebar={visibleCompanySidebar}
                    setVisibleCompanySidebar={setVisibleCompanySidebar}
                    companyDetailsId={companyDetailsId}
                    header={"Company details"}
                    isEditable={isCompanyDetailsSidebarEditable}
                    setIsEditable={setIsCompanyDetailsSidebarEditable}
                    isAddNewCompany={false}
                    // setIsAddNewCompany={false}
                    refreshParent={refreshOppsTable}
                />

                <div className="flex justify-content-center mb-4">
                    <SelectButton value={size} onChange={(e) => setSize(e.value)} options={sizeOptions} />
                </div>

                <DataTable
                    value={opportunities} size={size} loading={loading} dataKey="id" showGridlines stripedRows removableSort
                    
                    editMode="row" onRowEditComplete={onRowEditComplete}
                    onRowEditInit={onRowEditInit}

                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}

                    ref={dt}

                    expandedRows={expandedRows} /*onRowToggle={(e) => setExpandedRows(e.data)}*/
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                    rowExpansionTemplate={rowExpansionTemplate}

                    sortField="id" sortOrder={-1}

                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}

                    selectionMode="single" selection={selectedOpportunity} onSelectionChange={(e) => setSelectedOpportunity(e.value)} metaKeySelection="false"
                    onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}

                    filters={filters} globalFilterFields={['name', 'date', 'value', 'status', 'company']}

                    header={header}

                    emptyMessage={loading ? "loading..." : "No opportunities found."}>

                    <Column selectionMode="single" headerStyle={{ width: '3em' }}></Column>
                    <Column expander={allowExpansion} style={{ width: '3em' }} />

                    <Column field="id" header="Id" alignHeader="center"
                        filter filterPlaceholder="Search by Id"
                        style={{ minWidth: '2rem' }}
                    />
                    <Column field="name" header="Name" alignHeader="center"
                        editor={(options) => textEditor(options)}
                        filter filterPlaceholder="Search by name"
                        sortable style={{ minWidth: '8rem' }}
                    />
                    <Column field="company" header="Company" alignHeader="center"
                        body={companyBodyTemplate}
                        filter filterField="company" filterPlaceholder="Search by company"
                        sortable style={{ minWidth: '8rem' }}
                    />
                    <Column field="date" header="Starting Date" alignHeader="center"
                        editor={(options) => dateEditor(options, dateValue, setDateValue)}
                        filter filterField="date" filterElement={dateFilterTemplate}
                        dataType="date" locale="it" style={{ minWidth: '4rem' }}
                    />
                    <Column field="value" header="Value (K)" alignHeader="center"
                        editor={(options) => valueEditor(options)}
                        filter filterField="value" filterElement={valueFilterTemplate}
                        dataType="numeric" style={{ minWidth: '3rem' }} body={valueBodyTemplate}
                    />
                    <Column field="status" header="Status" alignHeader="center"
                        body={statusBodyTemplate}
                        editor={(options) => statusEditor(options, statuses, statusValue, setStatusValue)}
                        filter filterField="status" filterElement={statusFilterTemplate}
                        sortable
                        style={{ minWidth: '3rem' }}
                    />

                    <Column rowEditor />
                </DataTable>

                <div className="button-set">
                    <span className="p-buttonset">
                        <Button label="Add"
                            icon="pi pi-plus" severity="success" rounded
                            onClick={onClickAdd} />
                        <Button label="View/Edit"
                            icon="pi pi-eye" severity="info" rounded
                            disabled={isBtnDisabled}
                            onClick={onClickShow} />
                        <Button label="Delete"
                            icon="pi pi-trash" severity="danger" rounded
                            disabled={isBtnDisabled}
                            onClick={onClickDelete} />
                        <ConfirmDialog
                            visible={visible} onHide={() => setVisible(false)}
                            message={message} header="Delete Confirmation"
                            acceptClassName='p-button-danger' icon="pi pi-exclamation-triangle"
                            accept={accept} reject={reject} />
                        <AddOpportunityDialog
                            isAddVisible={isAddVisible}
                            addTrigger={addTrigger}
                            addOpportunity={addOpportunity} />
                        <ShowOpportunityDialog
                            isShowVisible={isShowVisible}
                            showTrigger={showTrigger}
                            selectedOpportunity={selectedOpportunity}
                            selectedRowId={selectedRowId}
                            refreshOppsTable={refreshOppsTable}
                            clickContactButton={clickContactButton}
                            types={types}
                            statuses={statuses} />
                    </span>
                    </div>
            </div>
        </div>
    );
}
