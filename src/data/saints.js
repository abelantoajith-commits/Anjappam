import motherTeresaImg from '../assets/saints/mother-teresa.png';
import stAnthonyImg from '../assets/saints/st-anthony.png';
import stElizabethImg from '../assets/saints/st-elizabeth.png';
import stVincentImg from '../assets/saints/st-vincent.png';
import stNicholasImg from '../assets/saints/st-nicholas.png';

export const SAINTS = [
  {
    id: "mother-teresa",
    name: "Mother Teresa",
    title: "St. Teresa of Calcutta",
    image: motherTeresaImg,
    kind: "quote",
    text: "...hungry, I give him a plate of rice, a piece of bread...",
    source: "Nobel Lecture, 11 December 1979"
  },
  {
    id: "st-anthony",
    name: "St. Anthony of Padua",
    title: "Patron of the poor",
    image: stAnthonyImg,
    kind: "quote",
    text: "Today Christ stands at the door and knocks in the person of his poor.",
    source: "Sermons of St. Anthony"
  },
  {
    id: "st-elizabeth",
    name: "St. Elizabeth of Hungary",
    title: "Patroness of charity",
    image: stElizabethImg,
    kind: "about",
    text: "...gave herself entirely to relieving the hungry.",
    source: "Letter of Conrad of Marburg, her spiritual director"
  },
  {
    id: "st-vincent",
    name: "St. Vincent de Paul",
    title: "Servant of the poor",
    image: stVincentImg,
    kind: "teaching",
    text: "Vincent taught the Daughters of Charity that serving the poor means more than handing out bread and soup. It means giving them respect and love.",
    source: "Conferences to the Daughters of Charity"
  },
  {
    id: "st-nicholas",
    name: "St. Nicholas",
    title: "Bishop of Myra",
    image: stNicholasImg,
    kind: "tradition",
    text: "Remembered by tradition as a generous bishop who quietly helped families in need, including in times of famine.",
    source: "Christian tradition"
  }
];
