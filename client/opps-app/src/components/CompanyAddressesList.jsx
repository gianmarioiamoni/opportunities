// CompanyAddressesList.jsx
//
// props:
//      - addresses = [
//          { 
//              addressId: "addId", 
//              id: "id", 
//              street: "street", number: "number", city: "city", zip: "zip", 
//              description: "description", 
//              LAT: "LAT", LNG: "LNG" 
//          }, ...]
//      
//

import React from "react";
import Map from "./Map";

export default function CompanyAddressesList(props) {
    if (props.addresses == null) {
        console.log("props.addresses is null");
    } else {
        const arrayDataListItems = props.addresses.map((a, index) => (
            <li key={a.id}>
                <div className="address-item">
                    <h4>{a.description}</h4>
                    <p>{a.street}, {a.number}</p>
                    <p>{a.zip} {a.city}</p>
                    {(a.LAT !== null && a.LNG !== null) ? (
                        <Map location={a} mapId={`google-map-${index}`} />
                    ) : (
                        <span></span>
                    )}
                </div>
            </li>
        ));

        return (
            <div className="addresses-list">
                <ul style={{ listStyle: 'none' }}>{arrayDataListItems}</ul>
            </div>
        );
    }
}
