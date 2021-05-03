import { resolveDarkdotApi } from "./connections"
import { startHttpServer } from "./express-api/server"
import { startNotificationsServerForTelegram } from "./express-api/telegramWS"
import { startNotificationsServer } from "./express-api/ws"
import { startSubstrateSubscriber } from "./substrate/subscribe"

const startOffchainServices = async () => {
  const { substrate } = await resolveDarkdotApi()
  startNotificationsServerForTelegram()
  startNotificationsServer()
  startHttpServer()
  startSubstrateSubscriber(substrate)
}

startOffchainServices()