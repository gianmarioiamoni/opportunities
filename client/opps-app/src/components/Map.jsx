// Map.jsx
// props:
//      - location
import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react';
import locationIcon from '@iconify/icons-mdi/map-marker';

const LocationPin = ({ text }) => (
    <div className="pin">
        <Icon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
);

const Map = (props) => {
    const location = {
        address: `${props.location.street}, ${props.location.number} ${props.location.zip}, ${props.location.city}`,
        lat: parseFloat(props.location.LAT),
        lng: parseFloat(props.location.LNG),
    };

    const zoomLevel = 12;

    const onMapClick = () => {
        window.open(`https://maps.google.com?q=${props.location.LAT},${props.location.LNG}`);
    };

    useEffect(() => {
        // Additional initialization logic, if needed
        console.log('Map component mounted.');
    }, []); // useEffect()

    return (
        <div className="map">
            <div className="google-map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY, libraries: 'places' }}
                    defaultCenter={location}
                    defaultZoom={zoomLevel}
                    defaultOptions={{ disableDefaultUI: true }}
                    onClick={onMapClick}
                >
                    <LocationPin lat={location.lat} lng={location.lng} text={location.address} />
                </GoogleMapReact>
            </div>
        </div>
    );
};

export default Map;


// Map.jsx
// VERSION WITHOUT GoogleMapReact
// keep it for reference


// import React, { useEffect } from 'react';

// import { Icon } from '@iconify/react';
// import locationIcon from '@iconify/icons-mdi/map-marker';

// const LocationPin = ({ text }) => (
//     <div className="pin">
//         <Icon icon={locationIcon} className="pin-icon" />
//         <p className="pin-text">{text}</p>
//     </div>
// );

// const Map = (props) => {
//     const { location, mapId } = props;
//     const zoomLevel = 12;

//     console.log("******** location = " + JSON.stringify(location))

//     useEffect(() => {
//         // Initialize the map when the component mounts
//         const initializeMap = () => {
//             const mapOptions = {
//                 center: {
//                     lat: parseFloat(location.LAT),
//                     lng: parseFloat(location.LNG),
//                 },
//                 zoom: zoomLevel,
//                 disableDefaultUI: true,
//             };

//             console.log(`********* intializeMap() - lat = ${mapOptions.center.lat}, lng = ${mapOptions.center.lng}`);

//             const mapDiv = document.getElementById(mapId);

//             if (mapDiv) {
//                 new window.google.maps.Map(mapDiv, mapOptions);
//             }
//         };

//         initializeMap();

//         // Additional cleanup if needed
//         return () => {
//             // Clean up resources, if necessary
//         };
//     }, [location, mapId]);

//     return (
//             <div className="map" id={mapId} style={{ width: '80%', height: '300px' }}>
//                 <LocationPin lat={location.lat} lng={location.lng} text={location.address} />
//             </div>
//     )
// };

// export default Map;
