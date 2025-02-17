import React from "react";
import "../assets/styles/DecorationSection.css";

const decorations = [
  {
    id: 1,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Eco-Friendly Table Decor",
    description: "Sustainable table decor for your events.",
  },
  {
    id: 2,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Biodegradable Party Accessories",
    description: "Perfect for eco-conscious celebrations.",
  },
  {
    id: 3,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Eco Soul Wall Art",
    description: "Beautiful wall art crafted from natural materials.",
  },
  {
    id: 4,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Compostable Event Supplies",
    description: "Stylish and sustainable event essentials.",
  },
  {
    id: 5,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Recycled Decorative Plates",
    description: "Unique plates made from recycled materials.",
  },
  {
    id: 6,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "Recycled Decorative Plates",
    description: "Unique plates made from recycled materials.",
  },
];

const DisposalSection = () => {
  return (
    <div className="decoration-section">
      <h2 className="decoration-title">Bestsellers Name</h2>
      <div className="decoration-scroll">
        {decorations.map((item) => (
          <div className="decoration-card" key={item.id}>
            <img src={item.image} alt={item.title} className="decoration-image" />
            <h3 className="decoration-card-title">{item.title}</h3>
            <p className="decoration-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisposalSection;
