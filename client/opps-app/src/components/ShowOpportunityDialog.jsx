import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from "primereact/tag";

import InteractionsTable from "./InteractionsTable";

import { edit } from '../services/opportunityService';

import { formatDate, formatCurrency, dateITStrToUSStr } from './exports/formatLocale'

import { getSeverity } from "./exports/templates";

import { statusEditorItemTemplate, statusEditorValueTemplate } from "./exports/editor";

import { isEmpty } from "./exports/common";


export default function AddOpportunityDialog(props) {

    const [visible, setVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [opp, setOpp] = useState({})

    let trigger = props.showTrigger;

    // value in it-IT locale format
    const value = (opp !== null && (!isEmpty(opp)) && formatCurrency(opp.value));

    // edited opportunity
    const [editedOpp, setEditedOpp] = useState({});

    // edited status value
    const [statusValue, setStatusValue] = useState();

    // edited date value
    const [dateValue, setDateValue] = useState();



    function onClickEdit() {
        // init status value on Dropdown
        const obj = props.statuses.find((o) => o.status === opp.status);
        setStatusValue(obj.id);

        // init date value
        // set opportunity edited date
        const dateUSStr = dateITStrToUSStr(opp.date);
        setDateValue(new Date(dateUSStr));

        setIsEditable(true);
        setEditedOpp({ ...opp });

    } // onClickEdit()


    async function onClickSave() {
        setOpp(editedOpp);

        await saveEditedOpportunity();
        
        setIsEditable(false);
        //setEditedOpp({});

    }; // onClickSave()


    function onClickClose() {
        setIsEditable(false);
        setVisible(false);

    } // onClickClose()


    async function saveEditedOpportunity() {

        const edOpp = createEditedOpportunity();

        try {
            await edit(edOpp);
            // setTrigger((t) => t + 1);
            props.refreshOppsTable();
            //setEditedDate(null);

        }
        catch (error) { console.log(error); }
    }


    const footerContent = (
        <div className="show-dialog-footer">
            <Button label="Close" icon="pi pi-times" onClick={onClickClose} autoFocus className="p-button-text" />
            {isEditable ? (
                <Button label="Save" icon="pi pi-file-edit" severity="info" onClick={onClickSave} />
            ) : (
                <Button label="Edit" icon="pi pi-file-edit" severity="warning" onClick={onClickEdit} />
            )}
        </div>
    );

    const headerContent = (
        <div>
            {isEditable ? (
                <InputText value={editedOpp.name} onChange={(e) => setEditedOpp({ ...editedOpp, name: e.target.value })} />
            ) : (
                <h2>{opp !== null && opp.name}</h2>
            )}
        </div>
    );

    useEffect(() => {
        if (props.selectedOpportunity !== null) {
            setOpp(props.selectedOpportunity);
            
            setStatusValue(props.selectedOpportunity.status);

        }

    }, [props.selectedOpportunity]); // eslint-disable-line react-hooks/exhaustive-deps
    

    useEffect(() => {
        if (trigger) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [trigger]); 

    function onChangeDate(e) {
        const date = e.target.value;
        date.setHours(0, 0, 0, 0);
        const dateFormatted = date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        setDateValue((prev) => (prev = e.target.value));
        return setEditedOpp((o) => ({ ...o, date: dateFormatted }));

    } // onChangedate()

    function onChangeStatus(e) {
        setEditedOpp({ ...editedOpp, statusId: e.value, status: props.statuses.find(s => s.id === e.value).status });
        setStatusValue((prev) => (prev = e.value));
    }

    function createEditedOpportunity() {
        //
        // date format
        //
        if (!isEmpty(editedOpp)) {
            const date = editedOpp.date;

            let dateFormatted = null;

            if (typeof (date) === 'string') {
                dateFormatted = date;
            } else {

                dateFormatted = formatDate(date);
            }

            //
            // create edited opportunity object
            //
            const edOpp = {
                id: editedOpp.id,
                name: editedOpp.name,
                company: editedOpp.companyId,
                date: dateFormatted,
                value: editedOpp.value,
                status: editedOpp.statusId
            };

            return edOpp;
        } else {
            return console.log("editedOpp is empty");
        }
    }


    return (
        <div className="card flex justify-content-center">
            <Dialog
                header={headerContent}
                visible={visible}
                style={{ width: 'auto', minWidth: '20%', height: 'auto', minHeight: '20%' }}
                modal={true}
                contentStyle={{ overflow: 'auto' }}
                onHide={() => setVisible(false)}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                maximizable
                footer={footerContent}>
                <div className="container">
                    <div className="show-date-field field col-13 md:col-6">
                        <h4 className="show-title show-date-title">Starting date</h4>
                        {isEditable ? (
                            <Calendar
                                id="date"
                                // value={opp.date}
                                value={dateValue}
                                onChange={onChangeDate}
                                showIcon
                                dateFormat="dd/mm/yy"
                                placeholder="dd/mm/yyyy"
                                mask="99/99/9999" />
                        ) : (
                            <p className="date">{opp !== null && opp.date}</p>
                        )}
                    </div>

                    <div className="show-company-field field col-13 md:col-4">
                        <h4 className="show-title show-company-title">Company</h4>
                        <p className="show-company">{opp !== null && opp.company}</p>
                    </div>

                    <div className="show-description-field field col-13 md:col-12">
                        <h4 className="show-title show-description-title">Description</h4>
                        {isEditable ? (
                            <textarea value={editedOpp.description}
                                rows="5"
                                onChange={(e) => setEditedOpp({ ...editedOpp, description: e.target.value })} />
                        ) : (
                            <p className="show-description">{opp !== null && opp.description}</p>
                        )}
                    </div>

                    <div className="show-value-field field col-13 md:col-4">
                        <h4 className="show-title show-value-title">Value (K)</h4>
                        {isEditable ? (
                            <InputNumber inputId="locale-italian"
                                value={editedOpp.value}
                                onValueChange={(e) => setEditedOpp({ ...editedOpp, value: e.value })}
                                mode="decimal"
                                locale="it-IT" />
                        ) : (
                            <p className="show-value">{value !== null && value}</p>
                        )}
                    </div>

                    <div className="show-status-field field col-13 md:col-4">
                        <h4 className="show-title show-status-title">Status</h4>
                        {isEditable ? (
                            <Dropdown value={statusValue} options={props.statuses} optionLabel="status" optionValue="id"
                                onChange={(e) => onChangeStatus(e)}
                                placeholder="Select a Status"
                                valueTemplate={statusEditorValueTemplate}
                                itemTemplate={statusEditorItemTemplate} />
                        ) : (
                            <Tag value={opp.status} severity={getSeverity(opp.status)} />
                        )}
                    </div>

                    <div className="show-interactions-field field col-13 md:col-12">
                        <InteractionsTable
                            oppName={opp !== null && opp.name}
                            id={opp !== null && opp.id}
                            types={props.types}
                            clickContactButton={props.clickContactButton} 
                            compId={opp.companyId}
                            />
                    </div>

                </div>
            </Dialog>
        </div>
    )
} // ShowOppotunityDialog()



