function Slider() {
    return (
        <div id="carouselExampleAutoplaying" className="carousel slide mt-2 mb-5 shadow-lg" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/assets/AnhSlider/1.png" style={{height:"650px"}} className="d-block w-100" alt="Anh 1" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/AnhSlider/2.png" style={{height:"650px"}} className="d-block w-100" alt="Anh 2" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/AnhSlider/3.png" style={{height:"650px"}} className="d-block w-100" alt="Anh 3" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/AnhSlider/4.png" style={{height:"650px"}} className="d-block w-100" alt="Anh 4" />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
export default Slider;