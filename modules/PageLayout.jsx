import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useIsMobile from '../hooks/useIsMobile';

const defaultTitle = 'Play Chameleon Online!';
const defaultDescription = `This is a completely free online version of the popular board game - "The Chameleon". The platform offers a seamless playing experience on desktop as well as on mobile devices and is perfect for both eye-to-eye and over-the-internet game sessions.`;
const baseUrl = 'https://the-chameleon.herokuapp.com/';

// interface Props {
//   description?: string;
//   googleSiteVerification?: string;
//   headerType?: "static" | "auth";
//   ogImage?: string;
//   title?: string;
//   url?: string;
// }

const Layout = ({
  children,
  title = '',
  description = defaultDescription,
  ogImage = '',
  googleSiteVerification = '',
  url = '',
  showChamelon = false,
}) => {
  const isMobile = useIsMobile();
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalUrl = `${baseUrl}${url}`;
  return (
    <>
      <Head>
        {/* design */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Primary SEO */}
        <title>{finalTitle}</title>
        <meta name="title" content={finalTitle} />
        <meta name="description" content={description} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={finalUrl} />
        <meta property="og:image" content={ogImage} />
        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={finalUrl} />
        <meta property="twitter:title" content={finalTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        {/* other */}
        {googleSiteVerification && <meta name="google-site-verification" content={googleSiteVerification} />}
      </Head>
      <main>{children}</main>
      <div className="footer-height" />
      {showChamelon && (
        <footer className="footer">
          <div className="inner-footer">
            <Image
              height={isMobile ? '100px' : '128px'}
              width={isMobile ? '100px' : '128px'}
              src="/chameleon_blue.png"
              quality="100"
            />
            <div className="footer-words">
              <h1>Chameleon</h1>
              <h2>Keep Hidden</h2>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Layout;
