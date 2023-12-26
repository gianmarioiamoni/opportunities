////////////
// ItemList.js
//
// props:
//      - header
//      - items
//      - setItems
//
import React from 'react';

export default function ItemList(props) {
    
    // // true IF WE ARE EDITING THE SELECTED INTERACTION
    // const [isEditInteraction, setIsEditInteraction] = useState(false);
    // setIsEditInteraction(false);

    const handleDelete = (id) => {
        if (props !== null) {
            console.log("^^^^^ ItemList - handleDelete()")
            const updatedItems = props.items !== null && props.items.filter((item) => item.id !== id);
            console.log("^^^^^ ItemList - handleDelete() - updateItems = " + JSON.stringify(updatedItems));
            props.setItems(updatedItems);
        }
    };

    // useEffect(() => {
    //     // if (props.items !== null) {
    //     //     setItems([...props.items]);
    //     // }
    // }, [props.items]) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <h4>{props.header}</h4>
            <ul style={{listStyle: "none"}}>
                {props.items !== null && props.items.map((item) => (
                    <li key={item.id}>
                        <div className='flex flex-row justify-content-between' style={{width: "30%", margin: "5px 0"}}>
                            {`${item.firstName} ${item.lastName}`}
                            <React.Fragment>
                                <button className="p-link mr-2" onClick={() => handleDelete(item.id)}>
                                    <span className="pi pi-trash" />
                                </button>
                            </React.Fragment>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

