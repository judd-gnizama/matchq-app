import './styles.css'

const Wrapper = (props) => {

    const {title, children} = props
    
    return (
        <div className="Wrapper">
            <div className="title">{title}</div>
            {children}
        </div>
    )
}; export default Wrapper;