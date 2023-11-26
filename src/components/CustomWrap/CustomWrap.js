import React, { useEffect, useState } from 'react';

const CustomWrap = ({ text, wrapAfter }) => {

    const handleWrap = () => {
        const result = [];
        for (let i = 0; i < text.length; i += wrapAfter) {
            result.push(text.slice(i, i + wrapAfter));
        }
        return result;
}

return (<div>{handleWrap().map(fragment => (<div>{fragment}</div>))}</div>);
};

export default CustomWrap;
