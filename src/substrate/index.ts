import { resolveDarkdotApi } from "../connections";
import { startSubstrateSubscriber } from "./subscribe";

resolveDarkdotApi().then(({ substrate }) => startSubstrateSubscriber(substrate))