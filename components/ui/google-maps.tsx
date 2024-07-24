type GoogleMapsEmbedProps = {
  coords?: any;
};

const GoogleMapsEmbed = ({ coords }: GoogleMapsEmbedProps) => {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&center=${coords?.latitude},${coords?.longitude}&zoom=13`;

  if (!coords?.latitude || !coords?.longitude) return null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={mapSrc}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GoogleMapsEmbed;
