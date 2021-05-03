import { resolveDarkdotApi } from "../connections";
import { startHttpServer } from "./server";

resolveDarkdotApi().finally(startHttpServer)