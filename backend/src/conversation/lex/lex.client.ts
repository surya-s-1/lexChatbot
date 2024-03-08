const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2")

const config = {
    region: process.env.LEX_REGION,
    credentials: {
        accessKeyId: process.env.LEX_ACCESS_KEY_ID,
        secretAccessKey: process.env.LEX_SECRET_ACCESS_KEY
    }
}

const client = new LexRuntimeV2Client(config)

export async function Bot(sessionId, userInput) {

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
        const { requestId, cfId, extendedRequestId } = error.$metadata
        console.log({ requestId, cfId, extendedRequestId })
        console.log(error)
    }
}