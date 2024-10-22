"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger("Bootstrap");
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "debug", "log", "verbose"],
    });
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });
    const ioAdapter = new platform_socket_io_1.IoAdapter(app);
    app.useWebSocketAdapter(ioAdapter);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(`WebSocket server is running on: ws://localhost:${port}/socket.io/`);
    logger.log(`IoAdapter initialized: ${!!ioAdapter}`);
}
bootstrap().catch((err) => {
    console.error("Error starting server:", err);
});
//# sourceMappingURL=main.js.map