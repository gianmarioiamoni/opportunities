//import './App.css';

import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";


import { TabView, TabPanel } from 'primereact/tabview';
import { Splitter, SplitterPanel } from "primereact/splitter";

import OppsTable from "./components/OppsTable";
import ClientDatabaseBody from "./components/ClientDatabaseBody";
import PieChartReport from "./components/PieChartReport";
import PieChartReportDetailed from "./components/PieChartReportDetailed";
import BarsChartReport from "./components/BarsChartReport";

//
// PrimeReact
//
import { PrimeReactProvider } from 'primereact/api';
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import 'primeicons/primeicons.css';
//primeflex
import 'primeflex/primeflex.css';


import './App.css';

function App() {
  return (
    <PrimeReactProvider>
      <div className="app-container">
        <Header />
        
        <TabView>
          
          <TabPanel header="Home" leftIcon="pi pi-home mr-2">
            <OppsTable />
          </TabPanel>

          <TabPanel header="Client database" leftIcon="pi pi-user mr-2">

            <Splitter>

              <SplitterPanel className="flex align-items-start justify-content-center" size={50}>
                <ClientDatabaseBody database="companies" header="Companies" />
              </SplitterPanel>

              <SplitterPanel className="flex align-items-start justify-content-center" size={50}>
                <ClientDatabaseBody database="contacts" header="Contacts" />
              </SplitterPanel>

            </Splitter>

          </TabPanel>

          <TabPanel header="Reports" leftIcon="pi pi-chart-bar mr-2">
            <div className="reports-container">
              {/* <div className="flex justify-content-around flex-wrap"> */}
                <PieChartReport id="pie1"/>
              <PieChartReportDetailed id="pie2" />
              
              <p id="empty"></p>

              {/* </div> */}

              {/* <div> */}
                <BarsChartReport id="bars"/>
              {/* </div> */}
            </div>
          </TabPanel>

        </TabView>
        
        <Footer />
      </div>
    </PrimeReactProvider>
  );
}

export default App;

// {/* <div className="companies-container">
//                 {/* <h3 className="companies-title">Companies</h3> */}
//                 <ClientDatabaseBody database="companies" header="Companies" />
//               </div>

//               <div className="contacts-container">
//                 {/* <h3 className="contacts-title">Contacts</h3> */}
//                 <ClientDatabaseBody database="contacts" header="Contacts" /> 
//               </div> */}
