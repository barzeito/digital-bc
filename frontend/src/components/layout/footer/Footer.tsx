import "./Footer.css";

const getYear = (): number => {
    return new Date().getFullYear();
};

function Footer(): JSX.Element {
    return (
        <div className="Footer">
            <p>&copy; {getYear()} WJS Digital Innovations Ltd</p>
        </div>
    );
}

export default Footer;
