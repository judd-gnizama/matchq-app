import './styles.css'
const Header = () => {
    return (
        <header className="Header">
            <nav>
                <h1>MatchQ</h1>
                <ul>
                    <li><a href="#">Queueing</a></li>
                    <li><a href="#">In Progress</a></li>
                    <li><a href="#">Archived</a></li>
                    <li><a href="#">Stats</a></li>
                </ul>
            </nav>
        </header>
    )
}; export default Header;