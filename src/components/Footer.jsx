import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-cover bg-center text-green-900 py-6 px-4 md:px-8"
      style={{ backgroundImage: "url('/images/bg-with-doodle.png')" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-600">
            PARTY <span className="text-green-900">DECOR</span> HUB
          </h2>
          <div className="flex flex-col items-center sm:text-center md:items-start ">
            <p className="flex sm:text-center items-start text-left ">
            <FaMapMarkerAlt className="mt-1 mr-2 text-lg md:text-xl text-green-800" />
              A-800, GD Colony, Mayur Vihar Phase-3, DELHI -110096
            </p>

            {/* <p className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-2 text-lg md:text-xl text-green-800" />
              A-800, GD Colony, Mayur Vihar Phase-3, DELHI -110096
            </p> */}
            <p className="flex items-center">
              <FaPhoneAlt className="mr-2 text-lg md:text-xl text-green-800" />
              <a href="tel:+917011676961" className="text-green-700 no-underline hover:underline">+91 7011676961</a>
            </p>
            <p className="flex items-center">
              <FaEnvelope className="mr-2 text-lg md:text-xl text-green-800" />
              <a href="mailto:info@gmail.com" className="text-green-700 no-underline hover:underline">info@gmail.com</a>
            </p>
          </div>
        </div>

        <hr className="md:hidden border-t border-green-500 my-1" />

        <div className="flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2 border-green-700 pb-2">Services</h2>
          <ul className="space-y-2 p-0">
            <li><a href="/party" className="text-base md:text-lg text-green-700 no-underline hover:text-red-600">🎈 Decoration Items</a></li>
            <li><a href="/decoration" className="text-base ml-4 md:text-lg text-green-700 no-underline hover:text-red-600">🎨 Decoration Services</a></li>
            <li><a href="/disposable" className="text-base md:text-lg text-green-700 no-underline hover:text-red-600">🛍️ Disposable Items</a></li>
          </ul>
        </div>

        <hr className="md:hidden border-t border-green-500 my-1" />

        <div className="flex flex-col items-center md:items-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2 border-green-700 pb-2">About Us</h2>
          <ul className="space-y-2 p-0">
            <li><a href="/about" className="text-base mr-2 md:text-lg text-green-700 no-underline hover:text-red-600">💡 Our Mission</a></li>
            <li><a href="/about" className="text-base mr-10 md:text-lg text-green-700 no-underline hover:text-red-600">🌎 Impact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-500 flex flex-col items-center justify-center pt-2 mt-4">
        <p className="text-sm md:text-base text-center">
          Made with ❤️ by <a href="https://pixeladsmedia.com" className="text-red-600 font-semibold underline hover:underline">Pixel Ads Media</a> | © 2025
        </p>

        <div className="flex space-x-6 text-green-800 ">
          <a href="#" className="text-green-800 hover:text-red-600 transition"><FaFacebookF size={24} /></a>
          <a href="https://www.instagram.com/partydecorhub_/?utm_source=qr#" target="_blank" className="text-green-800 hover:text-red-600 transition"><FaInstagram size={24} /></a>
          <a href="#" className="text-green-800 hover:text-red-600 transition"><FaYoutube size={24} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
