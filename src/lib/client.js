const { Client } = require('eris');
const CommandManager = require('./managers/commands');
const EventManager = require('./managers/events');
const TaskManager = require('./managers/tasks');

module.exports = class CommandoClient extends Client {
    /**
     * The `CommandoClient` is the start of your discord bot client.
     * 
     *  - All options must be in a [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) or in curly brackets (`{}`)
     *  - All options are in the types: `Commando.CommandoClientOptions & Eris.ClientOptions`
     * 
     * @param {CommandoClientOptions} options The options to setup your bot
     */
    constructor(options) {
        super(options.token, options.options);

        this.manager = new CommandManager(this);
        this.events = new EventManager(this);
        this.tasks = new TaskManager(this);
        this.language = new LanguageManager(this);
        this.inhibitors = new InhibitorManager(this);
        this.owners = options.owner;
        this.prefix = options.prefix;
        this.invite = options.invite;
        this.eventPath = options.events;
        this.commandPath = options.commands;
        this.tasksPath = options.tasks;
        
        if (options.defaultHelpCommand)
            this.manager.registerHelp();

        // don't emit 'messageCreate' unless it's not command handler related...
        this.on('messageCreate', (msg) => this.manager.handle(msg));
    }

    /**
     * Setups the bot
     */
    async setup() {
        this.manager.setup();
        this.events.setup();
        this.tasks.setup();
        this.language.setup();
        this.inhibitors.setup();
        super.connect();
    }

    /**
     * If the bot owner executed an naughty command or not!
     * 
     * @param {string} userID The user ID
     * @returns {boolean} If the owners executed it or not
     */
    isOwner(userID) {
        return this.owners.includes(userID);
    }

    /**
     * Gets the bot tag 
     * 
     * @example
     *  this.bot.tag; // => User#0001
     * @returns {string}
     */
    get tag() {
        return `${this.user.username}#${this.user.discriminator}`;
    }

    /**
     * Checks the current optime of the bot
     */
    getUptime() {
        return Date.now() - this.startTime;
    }
};

/**
 * @typedef {Object} CommandoClientOptions
 * @prop {string} commands The command path
 * @prop {string} events The event path
 * @prop {boolean} [defaultHelpCommand=false] If you want to use the default help command that Eris Commando provides. Default is `false`.
 * @prop {string} prefix The command prefix
 * @prop {string} invite The discord.gg invite if an error occured
 * @prop {string[]} owner The owner array or string
 * @prop {string} token The discord bot token
 * @prop {import('eris').ClientOptions} options The eris client options
 * @prop {string} tasks The tasks path
 */
