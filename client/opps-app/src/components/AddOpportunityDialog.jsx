import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import { getAllCompanies } from '../services/opportunityService';


export default function AddOpportunityDialog(props) {

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


    //
    // hooks
    //
    const [visible, setVisible] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [name, setName] = useState('');
    const [date, setDate] = useState(todayFormatted);
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');


    const newOpportunity = {
        name: "new opportunity",
        date: todayFormatted,
        description: "new description",
        company: null,
        value: 0 
    }


    function onClickSave() {
        date.setHours(0, 0, 0, 0);
        const dateFormatted = date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
        });

        newOpportunity.name = name;
        newOpportunity.date = dateFormatted;
        newOpportunity.description = description;
        newOpportunity.value = value;
        newOpportunity.company = selectedCompany; 
        
        props.addOpportunity(newOpportunity);
        
        setVisible(false);

    } // onClickSave()

    const onCompanyChange = (e) => {
        setSelectedCompany(e.value);
        console.log("selected company: " + e.value);

    } // onCompanyChange()

    const footerContent = (
        <div>
            <Button label="Discard" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={onClickSave} autoFocus />
        </div>
    );


    // trigger for calling a function in child element from parent element
    let trigger = props.addTrigger;

    useEffect(() => {
        getAllCompanies()
            .then( compList => setCompanies(compList) )
            .catch(console.log)

    }, []);

    useEffect(() => {
        if (trigger) {
            setVisible(true);
            setName("");
            setDate(null);
            setDescription("");
            setValue('');
            setSelectedCompany(null);
        } else {
            setVisible(false);
        }
    }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Add Opportunity"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                footer={footerContent}>
                
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={name} placeholder="Insert name" onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="date">Date</label>
                        <Calendar id="date" value={date} onChange={(e) => setDate(e.value)} showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="selectedCompany">Company</label>
                        <Dropdown id="selectedCompany" value={selectedCompany} options={companies} optionLabel="name" optionValue="id" onChange={onCompanyChange} placeholder="Select a Company" />
                    </div>

                </div>

                <div className="field col-13 md:col-4">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} cols={70} autoResize />
                </div>

                <div className="field col-12 md:col-3">
                        <label htmlFor="locale-italian">Value</label>
                        <InputNumber inputId="locale-italian" value={value} onValueChange={(e) => setValue(e.value)} mode="decimal" locale="it-IT" />
                </div>

                
            </Dialog>
        </div>
    )

} // AddOpportunityDialog()
        