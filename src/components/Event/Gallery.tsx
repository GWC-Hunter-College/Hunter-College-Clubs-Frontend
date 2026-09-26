import { useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconPhotoPlus } from "@tabler/icons-react";
import classes from "./Gallery.module.css";
import { IconButton } from "../ui/Button";
import EventArt from "../ui/EventArt";

type GalleryProps = {
  photos: string[];
  title: string;
  clubId: number;
  canManage?: boolean;
  mobile?: boolean;
};

export default function Gallery({ photos, title, clubId, canManage, mobile }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const hasPhotos = photos.length > 0;
  const count = hasPhotos ? photos.length : 1;

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  if (mobile) {
    const onScroll = () => {
      const el = scrollerRef.current;
      if (!el) return;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      if (i !== index) setIndex(i);
    };
    return (
      <div className={classes.mobileWrap}>
        <div className={classes.carousel}>
          <div className={classes.scroller} ref={scrollerRef} onScroll={onScroll}>
            {hasPhotos ? (
              photos.map((src, i) => <img key={i} src={src} alt={i === 0 ? title : `${title} photo ${i + 1}`} />)
            ) : (
              <EventArt alt={title} size="100%" radius={20} clubId={clubId} title={title} />
            )}
          </div>
          <span className={`${classes.mobileCounter} text-meta-mono-caps`}>
            {index + 1} / {count}
          </span>
        </div>
        {count > 1 && (
          <div className={classes.dots}>
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className={`${classes.dot} ${i === index ? classes.active : ""}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={classes.gallery}>
      <div className={classes.main}>
        {hasPhotos ? (
          <img src={photos[index]} alt={index === 0 ? title : `${title} photo ${index + 1}`} style={{ objectFit: "cover" }} />
        ) : (
          <EventArt alt={title} size="100%" radius={0} clubId={clubId} title={title} />
        )}
        <span className={`${classes.counter} text-meta-mono-caps`}>
          {index + 1} / {count}
        </span>
        {count > 1 && (
          <>
            <span className={`${classes.chevron} ${classes.chevronLeft}`}>
              <IconButton variant="glass" size={44} icon={<IconChevronLeft size={22} />} aria-label="Previous photo" onClick={() => goTo(index - 1)} />
            </span>
            <span className={`${classes.chevron} ${classes.chevronRight}`}>
              <IconButton variant="glass" size={44} icon={<IconChevronRight size={22} />} aria-label="Next photo" onClick={() => goTo(index + 1)} />
            </span>
          </>
        )}
      </div>
      {(hasPhotos && photos.length > 1) || canManage ? (
        <div className={classes.thumbs}>
          {hasPhotos &&
            photos.length > 1 &&
            photos.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`${classes.thumb} ${i === index ? classes.selected : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
              >
                <img src={src} alt="" />
              </button>
            ))}
          {canManage && (
            <div className={classes.soonTile}>
              <IconPhotoPlus size={22} aria-hidden="true" />
              <span className="text-meta-mono-caps">SOON</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
