import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Created } from "../generated/SmartWalletFactory/SmartWalletFactory";
import { Transfer, USDC } from "../generated/USDC/USDC";
import { SmartWallet, Trade } from "../generated/schema";
import {
  PositionChanged,
  PositionLiquidated
} from "../generated/ClearingHouse/ClearingHouse";
import { getAmmPosition } from "./helper";

export function handleCreated(event: Created): void {
  let wallet = new SmartWallet(event.params.smartWallet.toHexString());
  wallet.balance = BigInt.fromI32(0);
  wallet.blockCreated = event.block.number;
  wallet.tradeCount = BigInt.fromI32(0);
  wallet.tradeVolume = BigInt.fromI32(0);
  wallet.totalPnL = BigInt.fromI32(0);
  wallet.owner = event.params.owner;
  wallet.save();
}

export function handleTransfer(event: Transfer): void {
  let wallet = SmartWallet.load(event.params.from.toHexString());
  if (wallet == null) {
    wallet = SmartWallet.load(event.params.to.toHexString());
  }
  if (wallet == null) {
    return;
  }
  let contract = USDC.bind(event.address);
  wallet.balance = contract.balanceOf(Address.fromString(wallet.id));
  wallet.save();
}

export function handlePositionChanged(event: PositionChanged): void {
  let wallet = SmartWallet.load(event.params.trader.toHexString());
  if (wallet == null) {
    return;
  }
  wallet.tradeCount = wallet.tradeCount.plus(BigInt.fromI32(1));
  wallet.tradeVolume = wallet.tradeVolume.plus(event.params.positionNotional);
  wallet.totalPnL = wallet.totalPnL.plus(event.params.realizedPnl);
  wallet.save();

  let trade = Trade.load(event.transaction.hash.toHex());
  if (trade == null) {
    trade = new Trade(event.transaction.hash.toHex());
  }
  trade.wallet = Address.fromString(event.params.trader.toHexString());
  trade.trader = wallet.owner;
  trade.asset = event.params.amm;
  trade.size = event.params.exchangedPositionSize;
  trade.price = event.params.spotPrice;
  trade.timestamp = event.block.timestamp;
  trade.realizedPnl = event.params.realizedPnl;
  trade.fee = event.params.fee;
  trade.positionNotional = event.params.positionNotional;
  trade.save();

  let ammPosition = getAmmPosition(event.params.amm, event.params.trader);
  ammPosition.positionSize = event.params.positionSizeAfter;
  ammPosition.save();
}

export function handlePositionLiquidated(event: PositionLiquidated): void {
  let wallet = SmartWallet.load(event.params.trader.toHexString());
  if (wallet == null) {
    return;
  }
  let trade = Trade.load(event.transaction.hash.toHex());
  if (trade == null) {
    trade = new Trade(event.transaction.hash.toHex());
  }
  trade.liquidation = true;
  trade.save();
}
