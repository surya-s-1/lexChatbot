const { LexRuntimeV2Client, GetSessionCommand, PutSessionCommand, StartConversationCommand, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2")

const config = {
    region: "us-east-1",
    credentials: {
        accessKeyId: 'AKIA52CAQV6I64FIB37C',
        secretAccessKey: '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'
    }
}

const client = new LexRuntimeV2Client(config)

function sessionId() {
    return Date.now().toString()
}

const sessionNow = sessionId()

export async function Bot (userInput) {

    const input = {
        botId: "LCIYG1FODP",
        botAliasId: "LPMCX0SOWQ",
        localeId: "en_IN",
        sessionId: sessionNow,
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