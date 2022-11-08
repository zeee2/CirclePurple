export default {
    send: async (BanchoClient, username, message) => {
        const user = BanchoClient.getUser(username)
        user.sendMessage(message)
    }
}