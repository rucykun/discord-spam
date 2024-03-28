'use strict'
/**
 * @param xhr {XMLHttpRequest}
 * @returns {boolean}
 */
const isSuccessXHR = xhr => xhr !== void 0 && xhr !== null
    && xhr.readyState === 4
    && xhr.status >= 200 && xhr.status < 400

export class DiscordToken {
    /**
     * @constructor
     * @param token {string}
     * @returns {DiscordToken}
     */
    constructor(token) {
        if (!DiscordToken.validate.token(token)) throw new TypeError('Not in the form of a valid token')
        this.token = token
    }

    static validate = {
        /**
         * @param str {string}
         * @returns {boolean}
         */
        token(str) {
            return typeof str === 'string' && /^[MNO][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}$/.test(str)
        },
        /**
         * @param str {string}
         * @returns {boolean}
         */
        channelId(str) {
            return typeof str === 'string' && /^\d+$/.test(str)
        }

    /**
     * @returns {Promise<boolean>}
     */
    checkAlive() {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', 'https://discord.com/api/v9/users/@me/library')
            xhr.setRequestHeader('authorization', this.token)
            xhr.onload = () => void resolve(isSuccessXHR(xhr))
            xhr.onerror = () => void resolve(false)
            xhr.send()
        })
    }
    
    /**
     * @param options {{ channelId: string, content: string, tts: boolean }}
     * @returns {Promise<XMLHttpRequest>}
     */
    message(options) {
        return new Promise((resolve, reject) => {
            if (options === void 0 || options === null) reject(new TypeError('Cannot convert undefined or null to object'))
            if (!DiscordToken.validate.channelId(options.channelId)) reject(new TypeError('Not in the form of a valid channel id'))
            if (typeof options.content !== 'string') reject(new TypeError('Content must be of type string'))
            if (options.content.length === 0) reject(new RangeError('Content must be at least one character long'))
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `https://discord.com/api/v9/channels/${options.channelId}/messages`)
            xhr.setRequestHeader('authorization', this.token)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.onload = () => void (isSuccessXHR(xhr) ? resolve : reject)(xhr)
            xhr.onerror = () => void reject(xhr)
            xhr.send(JSON.stringify({ content: options.content, tts: !!options.tts }))
        })
    }
