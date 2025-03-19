import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import "./css/ButtonCSS.css";
function Button({text, type}){
    return (
        <button className="btn btn-custom" type={type}>{text}</button>
    );
}
export default Button;