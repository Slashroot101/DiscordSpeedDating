import { Message } from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";

const ACK_REACTIONS = ["👍", "💚"];
const EXPIRED_REACTIONS = ["🖤"];
const FAILURE_REACTIONS = ["⛔", "🚱"];

@injectable()
export class Reactor {
  enableReactions: boolean;
  constructor(@inject(TYPES.ReactionsEnabled) reactionsEnabled: boolean) {
		this.enableReactions = reactionsEnabled;
  }

  /** Indicates to the user that the command was executed successfully. */
  async success(message: Message) {
    if (!this.enableReactions) return;

    return message.react(this.getRandom(ACK_REACTIONS));
  }

  /** Indicates to the user that the command failed for some reason. */
  async failure(message: Message) {
    if (!this.enableReactions) return;

    await message.reactions.removeAll();
    return message.react(this.getRandom(FAILURE_REACTIONS));
  }

  /** Indicates to the user that the command is no longer active, as intended. */
  async expired(message: Message) {
    if (!this.enableReactions) return;

    await message.reactions.removeAll();
    return message.react(this.getRandom(EXPIRED_REACTIONS));
  }

  /** Gets a random element of an array. */
  private getRandom(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
