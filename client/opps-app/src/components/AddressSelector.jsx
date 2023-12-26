// AddressSelector.jsx
// props:
//      - initAddress = null | address
//      - setIsVisible
//      - addresses, setAddresses
//      - companyId
//
import React, { useState } from 'react';
import './AddressSelector.css'; // Import the CSS file for styling

import { Button } from 'primereact/button';

import { addAddress, addAddressToCompany } from '../services/opportunityService';


const AddressSelector = (props) => {

    // if props.initAddress != null is in edit mode
    const [address, setAddress] = useState(props.initAddress == null ? '' : props.initAddress);
    const [suggestions, setSuggestions] = useState([]);
    const [description, setDescription] = useState('');
    const [isSaveNewAddressBtnDisabled, setIsSaveNewAddressBtnDisabled] = useState(true);

    // new address elements
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [fullAddress, setFullAddress] = useState('');

    
    const handleAddressChange = (e) => {
        const inputText = e.target.value;

        if (window.google && window.google.maps) {
            const placesService = new window.google.maps.places.AutocompleteService();
            placesService.getPlacePredictions({ input: inputText }, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            });
        } else {
            console.error('Error: Google Maps API not loaded.');
        }

        setAddress(inputText);

    }; // handleAddressChange()


    const handleDescriptionChange = (e) => {
        const inputText = e.target.value;

        setDescription(inputText);

    } // handleDescriptionChange()


    const handleSelect = (suggestion) => {
        if (window.google && window.google.maps && suggestion.place_id) {
            const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

            console.log("placesService = " + JSON.stringify(placesService));

            placesService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const addressDetails = {
                        address: place.formatted_address,
                        coordinates: {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        },
                    };

                    console.log(addressDetails);
                    
                    // update value in inputText
                    setAddress(addressDetails.address);
                    setFullAddress(addressDetails.address);
                    setLat(addressDetails.coordinates.lat);
                    setLng(addressDetails.coordinates.lng);

                    // extract address elements from place
                    for (var i = 0; i < place.address_components.length; i++) {
                        for (var j = 0; j < place.address_components[i].types.length; j++) {
                            if (place.address_components[i].types[j] === "country") {
                                setCountry(place.address_components[i].long_name);
                            }
                            if (place.address_components[i].types[j] === "locality") {
                                setCity(place.address_components[i].long_name);
                            }
                            if (place.address_components[i].types[j] === "administrative_area_level_2") {
                                setState(place.address_components[i].short_name);
                            }
                            if (place.address_components[i].types[j] === "route") {
                                setStreet(place.address_components[i].long_name);
                            }
                            if (place.address_components[i].types[j] === "street_number") {
                                setNumber(place.address_components[i].long_name);
                            }
                            if (place.address_components[i].types[j] === "postal_code") {
                                setZip(place.address_components[i].long_name);
                            }
                        }
                    }

                    setIsSaveNewAddressBtnDisabled(address === '');  

                    setSuggestions([]);
                } else {
                    console.error('Error in getDetails:', status);
                }
            });
        } else {
            console.error('Error: Missing place_id or Google Maps API not loaded.');
        }
    }; // handleSelect()


    function cancelAddNewAddress() {
        props.setIsVisible(false);

    } // cancelAddNewAddress()


    async function addNewAddress() {
        // create newAddressObj
        let addObj = {
            fullAddress: fullAddress,
            LAT: lat,
            LNG: lng,
            street: street,
            number: number,
            state: state,
            zip: zip,
            city: city,
            country: country,
            description: description

        };

        // add the new address to the db
        await addAddress(addObj)
            .then(res => {

                // update id 
                addObj = { id: res.insertId, ...addObj };
                
                // add new address object to the parent addresses
                props.setAddresses([...props.addresses, addObj]);

                // no more visible
                props.setIsVisible(false);

                // add row to companies_has_addresses to add address to company
                addAddressToCompany(addObj, props.companyId)
                    .then()
                    .catch(console.log)
                
                return addObj;
            })
            .catch(console.log);


    } // addNewAddress()

    return (
        <div className="address-selector-container" style={{width: "95%"}}>
            <div className="p-field address-input flex justify-content-between">
                <div className="addressInput flex justify-content-between flex-wrap align-items-start">
                    <label htmlFor="addressInput">Enter Address:</label>
                    <input
                        id="addressInput"
                        className="addressInput"
                        value={address}
                        style={{minWidth: "250px"}}
                        onChange={handleAddressChange}
                        placeholder="Type an address..."
                    />
                </div>
                <div className="address-input flex justify-content-between flex-wrap align-items-start">
                    <label htmlFor="addressDescription">Enter Description:</label>
                    <input
                        id="addressDescription"
                        className="addressInput"
                        value={description}
                        style={{minWidth: "200px"}}
                        onChange={handleDescriptionChange}
                        placeholder="Type a description..."
                    />
                </div>
                <div className="address-input flex justify-content-between align-items-center">
                    <Button
                        icon="pi pi-save"
                        text
                        severity="info"
                        aria-label="Save"
                        className="p-button-rounded p-button-info"
                        data-pr-tooltip="Save the new address"
                        disabled={isSaveNewAddressBtnDisabled}
                        onClick={() => addNewAddress()}
                    />
                    <Button
                        icon="pi pi-times"
                        text
                        severity="danger"
                        aria-label="Cancel"
                        className="p-button-rounded p-button-danger"
                        data-pr-tooltip="Cancel changes"
                        onClick={() => cancelAddNewAddress()}
                    />
                </div>
                
            </div>

            {/* Display suggestions */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.place_id} onClick={() => handleSelect(suggestion)}>
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressSelector;

