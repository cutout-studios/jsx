/** @jsxImportSourceTypes @cutout/web/format/html */

import { createServer } from "@cutout/web";

import AppElement from "./resources/App.tsx";
import HomeRoute from "./resources/Home.tsx";

const server = createServer(HomeRoute, AppElement);

server();
