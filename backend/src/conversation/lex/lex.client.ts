import { ConfigModule } from "@nestjs/config"
const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2")

export async function Bot(sessionId, userInput) {
    await ConfigModule.envVariablesLoaded

    const config = {
        region: process.env.LEX_REGION,
        credentials: {
            accessKeyId: process.env.LEX_ACCESS_KEY_ID,
            secretAccessKey: process.env.LEX_SECRET_ACCESS_KEY
        }
    }
    
    const client = new LexRuntimeV2Client(config)

    const input = {
        botId: process.env.LEX_BOT_ID,
        botAliasId: process.env.LEX_BOT_ALIAS_ID,
        localeId: process.env.LEX_LOCALE_ID,
        sessionId: sessionId,
        text: userInput
    }

    const command = new RecognizeTextCommand(input)

    try {
        const response = await client.send(command)
        return response
    } catch (error) {
        console.log(error)
    }
}