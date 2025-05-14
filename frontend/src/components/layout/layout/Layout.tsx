import Footer from '../footer/Footer';
import Routing from '../routing/Routing';
import './Layout.css';

function Layout(): JSX.Element {
    return (
        <div className="Layout">
            <main>
                <Routing />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}

export default Layout;