import {SubstrateEvent} from "@subql/types";
import {Block, Account} from "../types";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
// Extract block information from argument
const blockID = event.block.block.header.hash.toString();
const blockNumber = event.block.block.header.number;
const timestamp = event.block.timestamp.toISOString();

// Fetch block from database
const block = await Block.get(blockID);

// Create new block if not in database
if (!block) {
  const newBlock = new Block(blockID);
  newBlock.timestamp = new Date(timestamp);
  newBlock.blockNumber = blockNumber.toBigInt();
  await newBlock.save();
}

// Extract event information from argument
const eventIndex = event.idx;
const address = event.event.data[0].toString();

// Fetch account from database
const account = await Account.getByAddress(address);

// Create new account if not in database
if (!account) {
  const newAccount = new Account(`${blockNumber.toNumber()}-${eventIndex}`);
  newAccount.address = address;
  newAccount.blockId = blockID;
  await newAccount.save();
}
}
