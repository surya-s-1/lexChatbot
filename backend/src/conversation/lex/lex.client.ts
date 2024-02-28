const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2")

const config = {
    region: "us-east-1",
    credentials: {
        accessKeyId: 'AKIA52CAQV6I64FIB37C',
        secretAccessKey: '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'
    }
}

const client = new LexRuntimeV2Client(config)

export async function Bot(sessionId, userInput) {

    const input = {
        botId: "Z9HEIJJPDN",
        botAliasId: "VQLV9AOWIR",
        localeId: "en_US",
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