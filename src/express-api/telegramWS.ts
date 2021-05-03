import * as WebSocket from 'ws'
import { newLogger } from '@darkpay/dark-utils'
import { EVENT_SEND_FOR_TELEGRAM, eventEmitter, Type } from './events';
import { offchainTWSPort } from '../env';
import BN from 'bn.js';
import { getActivity } from '../postgres/selects/getActivity';
import { Activity as OldActivity } from '@darkpay/dark-types'
import { getChatIdByAccount } from '../postgres/selects/getChatIdByAccount';

require('dotenv').config()

export type Activity = Omit<OldActivity, 'id'> & {
	block_number: string,
	event_index: number
}

export const log = newLogger('Telegram WS')

export let wss: WebSocket.Server

export const resolveWebSocketServer = () => {
	if (!wss) {
		const port = parseInt(offchainTWSPort)
		wss = new WebSocket.Server({ port }, () => {
			log.info(`Started web socket server for Notifications Counter on port ${port}`)
		})
	}
	return wss
}

export const wsClients: { [account: string]: WebSocket } = {}

export function sendActivity(account: string, activity: Activity, chatId: number, client: WebSocket) {
	const msg = JSON.stringify({ activity, chatId })
	client.send(msg)
	log.debug(`Message '${msg}' sent to account`, account)
}

export function startNotificationsServerForTelegram() {
	resolveWebSocketServer()
	wss.on('connection', (ws: WebSocket) => {
		ws.on('message', async (data: string) => {
			log.debug('Received a message with data:', data)
		})

		eventEmitter.on(EVENT_SEND_FOR_TELEGRAM, async (account: string, whom: string, blockNumber: BN, eventIndex: number, type: Type) => {
			const activity = await getActivity(account, blockNumber, eventIndex)
			const chatId = await getChatIdByAccount(whom)
			if (chatId && activity)
				ws.send(JSON.stringify({ activity, chatId, type }))


			// sendActivity(account, activity, chatId, client)
		})

		ws.on('close', (ws: WebSocket) => {
			log.info('Closed web socket server:', ws)
			wss.removeAllListeners(EVENT_SEND_FOR_TELEGRAM)
		})
	})

	wss.on('close', () => {
		log.info('Closed web socket server')
	})
}
