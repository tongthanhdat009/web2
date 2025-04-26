function TieuDeDanhSach(props){
    return(
        <div className="mt-2 mb-2" style={{marginLeft:'10%', marginRight:'10%'}}>
            <div className="title-content">
                <h2 className="text-center text-dark">{props.TieuDeDanhSach}</h2>

                <div className="description d-flex align-items-center">
                    <div className="flex-grow-1 mx-3">
                        <div className="border-bottom border-3 border-dark"></div>
                        <div className="border-bottom border-3 border-dark mt-1"></div>
                    </div>

                    <p className="text-secondary mb-0 text-nowrap">{props.MoTa}</p>

                    <div className="flex-grow-1 mx-3">
                        <div className="border-bottom border-3 border-dark"></div>
                        <div className="border-bottom border-3 border-dark mt-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TieuDeDanhSach;