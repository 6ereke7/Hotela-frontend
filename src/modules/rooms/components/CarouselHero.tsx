import { useState } from "react";
import { Carousel } from "react-bootstrap";

const heros = [
  {
    title: "Make yourself at home",
    short:
      "A thoughtful stay, a softer pace, and a place that feels like it was waiting just for you.",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Make yourself at home",
    short:
      "A thoughtful stay, a softer pace, and a place that feels like it was waiting just for you.",
    img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Make yourself at home",
    short:
      "A thoughtful stay, a softer pace, and a place that feels like it was waiting just for you.",
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85",
  },
];

export const CarouselHero = () => {
  const [index, setIndex] = useState(0);
  return (
    <Carousel
      fade
      activeIndex={index}
      onSelect={setIndex}
      className="w-70 mx-auto"
    >
      {heros.map((hero, i) => (
        <Carousel.Item key={i}>
          <img
            className="d-block w-100 object-fit-cover"
            src={hero.img}
            alt="Second slide"
            style={{ height: "600px" }}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded">
            <h3>{hero.title}</h3>
            <p>{hero.short}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
