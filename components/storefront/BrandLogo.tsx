export function BrandLogo({ src, name }: { src: string; name: string }) {
  // The supplied artwork includes whitespace; frame it with CSS without editing it.
  const supplied = src === "/brand/amaze-logo.png";
  const maxforce = src === "/brand/maxforce-logo.jpg";
  return (
    <span className={maxforce ? "maxforce-logo" : supplied ? "amaze-logo" : "custom-logo"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} width={1600} height={800} />
    </span>
  );
}
