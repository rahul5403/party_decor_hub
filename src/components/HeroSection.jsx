import React from "react";
import Slider from "react-slick";
import "../assets/styles/HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate()

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => <ul className="custom-dots"> {dots} </ul>,
    customPaging: () => <div className="custom-dot"></div>,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>

        <div onClick={() =>  navigate("/decoration")} className="carousel-slide slide2">
          <div className="overlay"></div>
          <div className="carousel-text">
            <h1>Sustainable Living</h1>
            <p>Eco-friendly products for your daily needs.</p>
          </div>
        </div>
        <div onClick={() =>  navigate("/disposable")} className="carousel-slide slide3">
          <div className="overlay"></div>
          <div className="carousel-text">
            <h1>Go Green</h1>
            <p>Make a difference with sustainable choices.</p>
          </div>
        </div>
        <div onClick={() =>  navigate("/party")} className="carousel-slide slide1">
          <div className="overlay"></div>
          <div className="carousel-text">
            <h1>Cheers to <span>2025</span></h1>
            <p>Grab Ecosoul Products up to 70% Off!</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default HeroSection;



// import React from "react";
// import Slider from "react-slick";
// import "../assets/styles/HeroSection.css";

// const HeroSection = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: false,
//     appendDots: dots => (
//       <ul style={{ margin: "0" }}> {dots} </ul>
//     ),
//     customPaging: i => (
//       <div className="custom-dot"></div>
//     ),
//   };

//   return (
//     <div className="carousel-container">
//       <Slider {...settings}>
//         <div className="carousel-slide">
//           <img src="" />
//           <div className="carousel-text">
//             <h1>Cheers to <span>2025</span></h1>
//             <p>Grab Ecosoul Products up to 70% Off!</p>
//           </div>
//         </div>
//         <div className="carousel-slide">
//           <img src="path-to-image2.jpg"  />
//           <div className="carousel-text">
//             <h1>Sustainable Living</h1>
//             <p>Eco-friendly products for your daily needs.</p>
//           </div>
//         </div>
//         <div className="carousel-slide">
//           <img src="path-to-image3.jpg" />
//           <div className="carousel-text">
//             <h1>Go Green</h1>
//             <p>Make a difference with sustainable choices.</p>
//           </div>
//         </div>
//       </Slider>
//     </div>
//   );
// };

// export default HeroSection;
