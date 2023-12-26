// opportunityService.jsx

const domain = "http://localhost";
const port = "3001";
export const baseURL = domain + ":" + port;

//
// opportunities
//

export const getAll = () => fetch(baseURL + '/opportunities', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))
    

export const getOpportunityById = (id) => fetch(baseURL + `/opportunities/${id}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getCompanyOpportunities = (id) => fetch(baseURL + `/opportunities/companies/${id}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))


export const add = (opportunity) => fetch(baseURL + '/opportunities', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(opportunity)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const edit = (opportunity) => fetch(baseURL + `/opportunities/${opportunity.id}`, {
    method: 'PUT',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(opportunity)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const remove = (id) => fetch(baseURL + `/opportunities/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))


//
// interactions
//
export const getOpportunityAllInteractions = (oppId) => fetch(baseURL + `/interactions/opportunity/${oppId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const getAllTypes = () => fetch(baseURL + '/types', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getContactInteractions = (id) => fetch(baseURL + `/interactions/contacts/${id}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))


export const addInteraction = (interaction) => fetch(baseURL + '/interactions', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(interaction)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const addContactsToInteraction = (contacts, intId) => fetch(baseURL + `/interactions/${intId}/contacts`, {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(contacts)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const editInteraction = (interaction) => fetch(baseURL + `/interactions/${interaction.id}`, {
    method: 'PUT',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(interaction)
})
    .then(res => res.json())
    .catch((error) => console.log(error))
    

export const getMaxInteractionsId = (oppId) => fetch(baseURL + `/opportunities/${oppId}/interactions/Id`, {
    method: 'GET',
    headers: {
        "Accept": 'application/json'
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const removeInteraction = (id) => fetch(baseURL + `/interactions/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))

// 
// contacts
// 
export const getInteractionAllContacts = (oppId) => fetch(baseURL + `/contacts/interaction/${oppId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getAllContacts = () => fetch(baseURL + `/contacts`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const getContactById = (contId) => fetch(baseURL + `/contacts/${contId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getMaxContactsId = () => fetch(baseURL + `/contacts/new/Id`, {
    method: 'GET',
    headers: {
        "Accept": 'application/json'
    }
})
    .then(res => {
        return res.json();
    })
    .catch((error) => console.log(error))

export const addContact = (contact) => fetch(baseURL + '/contacts', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(contact)
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const editContact = (contact) => fetch(baseURL + `/contacts/${contact.id}`, {
    method: 'PUT',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(contact)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const removeContact = (id) => fetch(baseURL + `/contacts/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))

//
// companies
//
export const getAllCompanies = () => fetch(baseURL + '/companies', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const getCompanyById = (compId) => fetch(baseURL + `/companies/${compId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getCompanyContacts = (compId) => fetch(baseURL + `/companies/${compId}/contacts`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const getMaxCompaniesId = () => fetch(baseURL + `/companies/new/Id`, {
    method: 'GET',
    headers: {
        "Accept": 'application/json'
    }
})
    .then(res => {
        return res.json();
    })
    .catch((error) => console.log(error))

export const addCompany = (company) => fetch(baseURL + '/companies', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(company)
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const removeCompany = (id) => fetch(baseURL + `/companies/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))

export const editCompany = (company) => fetch(baseURL + `/companies/${company.id}`, {
    method: 'PUT',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(company)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


//
// sectors
//
export const getAllSectors = () => fetch(baseURL + '/sectors', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getSectorCompanies = (sectId) => fetch(baseURL + `/sectors/${sectId}/companies`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const addSector = (sector) => fetch(baseURL + '/sectors', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(sector)
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const editSector = (sector) => fetch(baseURL + `/sectors/${sector.id}`, {
    method: 'PUT',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(sector)
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const removeSector = (id) => fetch(baseURL + `/sectors/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))

//
// statuses
//
export const getAllStatuses = () => fetch(baseURL + '/statuses', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getStatusSeverities = () => fetch(baseURL + `/statuses/severities`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))


export const getStatusSeverity = (status) => fetch(baseURL + `/statuses/${status}/severities`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    // res.json() takes a JSON object as input and parse it as JS object
    .then(res => res.json())
    .catch((error) => console.log(error))


//
// addresses
//
// export const getCompanyAllAddresses = (compId) => fetch(baseURL + `/addresses/company/${compId}`, {
//     method: 'GET',
//     headers: {
//         'Accept': 'application/json',
//     }
// })
//     .then(res => res.json())
//     .catch((error) => console.log(error))

export const getCompanyAddresses = (companyId) => fetch(baseURL + `/companies/${companyId}/addresses`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const addAddress = (address) => fetch(baseURL + '/addresses', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(address)
})
    .then(res => res.json())
    .catch((error) => console.log(error))


export const addAddressToCompany = (address, companyId) => fetch(baseURL + `/companies/${companyId}/addresses`, {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(address)
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const removeAddress = (id) => fetch(baseURL + `/addresses/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .catch((error) => console.log("error = " + error))



//
// geolocalization
//

export async function getCoordinates(address) {

    const apiKey = process.env.REACT_APP_API_KEY2; //'YOUR_API_KEY';
    // const addressStr = `${address.street} ${address.number} ${address.zip} ${address.city}`
    const addressStr = address.fullAddress;
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressStr)}&key=${apiKey}`;

    console.log("url = " + url);

    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;

        console.log("getCoordinates() - location = " + JSON.stringify(location));
        return location; // Return the location object
    } else {
        throw new Error('Geocoding request failed or returned no results.');
        //return null;
    }
}

//
// REPORTS
//
export const getReportsOpportunitiesGeneral = () => fetch(baseURL + `/reports/opportunities/general`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getReportsOpportunitiesDetailed = () => fetch(baseURL + `/reports/opportunities/detailed`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))

export const getReportsOpportunitiesPerSectors = () => fetch(baseURL + `/reports/opportunities/sectors`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(res => res.json())
    .catch((error) => console.log(error))







