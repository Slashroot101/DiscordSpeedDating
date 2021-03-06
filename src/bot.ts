import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {CommandHandler} from "./models/CommandHandler";
import container from "./inversify.config";
import { Reactor } from "./models/Reactor";
import {CommandGroup} from "./models/CommandGroup";
@injectable()
export class Bot {
	private client: Client;
  private readonly token: string;
	private commandHandler: CommandHandler;

  constructor(
    @inject(TYPES.Client) client: Client,
		@inject(TYPES.Token) token: string,
  ) {
    this.client = client;
		this.token = token;
		const serverPrefix = new Map<string, string>();
		serverPrefix.set('515752149771223050', '!');
		this.commandHandler = new CommandHandler(
			serverPrefix,
			container.resolve<Reactor>(Reactor),
		);
	}
	
	public withCommandGroup(commandGroup: CommandGroup): Bot {
		this.commandHandler.withCommandGroup(commandGroup);
		return this;
	}

	public withCommandGroups(commandGroup: CommandGroup[]): Bot {
		this.commandHandler.withCommandGroups(commandGroup);
		return this;
	}

  public listen(): Promise < string > {
    this.client.on('message', (message: Message) => {
			console.log(message.content);
      this.commandHandler.handleMessage(message);
    });

    return this.client.login(this.token);
  }
}