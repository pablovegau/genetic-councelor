import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "../base.css";
import "../style-props.generated.css";
import "../tokens.generated.css";

afterEach(cleanup);
