import React from "react";

function Footer() {
    
    const year = new Date().getFullYear();
    
    return (
        <footer>
            <p>ⓒ {year} CIMAN01</p>
        </footer>
    ); 
}

export default Footer;