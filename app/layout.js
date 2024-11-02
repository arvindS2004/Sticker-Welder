// layout.js
import './globals.css';

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <div className="container">
                    <header className="header">
                        <h1 style={{color:'black'}}>Sticker Welder 🔧</h1>
                    </header>
                    {children}
                </div>
            </body>
        </html>
    );
};

export default Layout;
