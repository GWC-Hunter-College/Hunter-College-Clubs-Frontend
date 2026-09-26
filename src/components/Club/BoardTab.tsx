import { IconCopy } from "@tabler/icons-react";
import classes from "./BoardTab.module.css";
import cardArt from "../../assets/card.png";
import heroArt from "../../assets/hero.png";
import raArt from "../../assets/ra.png";
import logoArt from "../../assets/logo.png";

const TEASER_ITEMS = [
  { src: cardArt, top: 24, left: "6%", width: 120, height: 150, rotate: -8 },
  { src: heroArt, top: 60, left: "24%", width: 140, height: 100, rotate: 5 },
  { src: raArt, top: 20, left: "44%", width: 110, height: 140, rotate: -4 },
  { src: logoArt, top: 90, left: "62%", width: 100, height: 100, rotate: 9 },
  { src: cardArt, top: 260, left: "12%", width: 130, height: 100, rotate: 6 },
  { src: heroArt, top: 300, left: "34%", width: 120, height: 150, rotate: -6 },
  { src: raArt, top: 250, left: "56%", width: 140, height: 100, rotate: 3 },
  { src: logoArt, top: 320, left: "78%", width: 110, height: 110, rotate: -9 },
];

/** Decorative, blurred "board" teaser behind the Board tab's coming-soon card. Not real content. */
export default function BoardTab() {
  return (
    <div className={classes.panel}>
      <div className={classes.teaser} aria-hidden="true">
        {TEASER_ITEMS.map((item, i) => (
          <div
            key={i}
            className={classes.item}
            style={{ top: item.top, left: item.left, width: item.width, height: item.height, transform: `rotate(${item.rotate}deg)` }}
          >
            <img src={item.src} alt="" />
          </div>
        ))}
      </div>
      <div className={classes.scrim}>
        <div className={classes.card}>
          <div className={classes.icon}>
            <IconCopy size={28} aria-hidden="true" />
          </div>
          <h2 className={`${classes.title} text-heading-l`}>The club board is coming soon</h2>
          <p className={`${classes.text} text-body-m`}>
            A shared wall of photos and notes that members add to and the e-board approves. This feature isn&rsquo;t available yet.
          </p>
        </div>
      </div>
    </div>
  );
}
