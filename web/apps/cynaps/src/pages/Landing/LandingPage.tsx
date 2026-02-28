import { CynapsLanding } from "./components/CynapsLanding";
import type { Page } from "../types/Page";
import "./landing.css";

export const LandingPage: Page = () => {
  return <CynapsLanding />;
};

LandingPage.title = "Welcome";
LandingPage.path = "/";
LandingPage.exact = true;

