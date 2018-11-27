const WebSocket = require("ws")
const http = require("http")

import { GAME_PROTOCOL_NAME } from "../../common/src/constants"
import { Logging } from "../../common/src/logging/logging"

const SERVER_PORT = require("../../config.json").server_port

class Server {
    private httpServer: any
    private wsServer: any
    private port = SERVER_PORT
    private protocol_name = GAME_PROTOCOL_NAME
    private onConnect: null | Function = null
    private logger: any = Logging.newLogger("Server")

    constructor() {
        this.httpServer = http.createServer((request: any, response: any) => {
            this.logger.log("HTTP request:" + request.url)
            response.writeHead(404)
            response.end()
        })
    }

    start() {
        this.httpServer.listen(this.port, () => {
            this.logger.info("Listening at port " + this.port)
        })

        this.wsServer = new WebSocket.Server({
            server: this.httpServer,
        })

        this.wsServer.on("connection", (socket: any, request: any) => {
            this.logger.success("New connection from: " + request.connection.remoteAddress)

            if (this.onConnect) {
                this.onConnect(socket)
            }
        })
    }

    onClientConnect(callback: Function) {
        this.onConnect = callback
    }
}

export { Server }
