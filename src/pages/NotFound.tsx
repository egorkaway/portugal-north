import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { absoluteUrl } from "@/lib/site";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Portugal by Train</title>
        <meta name="description" content="The page you were looking for could not be found. Return to the homepage to explore train stations across Portugal." />
        <meta property="og:title" content="Page Not Found | Portugal by Train" />
        <meta property="og:description" content="The page you were looking for could not be found. Return to the homepage to explore train stations across Portugal." />
        <meta property="og:url" content={absoluteUrl(location.pathname)} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
