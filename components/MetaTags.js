import Head from "next/head";

const MetaTags = ({ title, description, openGraphImageAbsoluteUrl, url }) => {
  const metaTitle = title ? `${title} — Helium Vote` : "Helium Vote";
  const metaDescription = description
    ? description
    : "Helium Vote is where the Helium Community comes together to make decisions on the Network.";
  const metaImage = openGraphImageAbsoluteUrl
    ? openGraphImageAbsoluteUrl
    : "https://heliumvote.com/images/og.png";
  const metaUrl = url ? url : "https://heliumvote.com";

  return (
    <Head>
      {/* General Meta Tags */}
      <title>{metaTitle}</title>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={metaDescription} />

      {/* Item Props */}
      <meta itemProp="name" content={metaTitle} />
      <meta itemProp="description" content={metaDescription} />
      <meta itemProp="image" content={metaDescription} />

      {/* Twitter */}
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image:src" content={metaImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@helium" />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="Helium Vote" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
    </Head>
  );
};

export default MetaTags;
