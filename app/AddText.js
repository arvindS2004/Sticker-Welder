import React from 'react';

const AddText = ({ textareaVisible, toggleTextarea, increaseFontSize, decreaseFontSize }) => {
    return (
        <>
            {textareaVisible && (
                <div style={{display:'flex', alignItems:'center',justifyContent:'center',gap:'10px'}}>
                    <button onClick={toggleTextarea}>
                        Delete Text
                    </button>
                    <button onClick={increaseFontSize}>+</button>
                    <button onClick={decreaseFontSize}>-</button>
                </div>
            )}
        </>
    );
};

export default AddText;
