import {
  BigInt,
  Address
} from "@graphprotocol/graph-ts"
import {
  SmartWalletFactory,
  Created
} from "../generated/SmartWalletFactory/SmartWalletFactory"
import {
  Transfer,
  USDC
} from "../generated/USDC/USDC"
import { Order,
  TrailingOrder,
  SmartWallet
} from "../generated/schema"
import {
  PositionChanged
} from "../generated/ClearingHouse/ClearingHouse"
import {
  getSmartWalletOwner
} from "./helper"

export function handleCreated(event: Created): void {
  let entity = new SmartWallet(event.params.smartWallet.toHexString())
  entity.balance = BigInt.fromI32(0)
  entity.blockCreated = event.block.number
  entity.tradeCount = BigInt.fromI32(0)
  entity.tradeVolume = BigInt.fromI32(0)
  entity.owner = event.params.owner
  entity.save()
}

export function handleTransfer(event: Transfer): void {
  let wallet = SmartWallet.load(event.params.from.toHexString())
  if(wallet == null) {
    wallet = SmartWallet.load(event.params.to.toHexString())
    if(wallet == null) {
      //do nothing
    } else {
      let contract = USDC.bind(event.address)
      wallet.balance = contract.balanceOf(Address.fromString(wallet.id))
      wallet.save()
    }
  }
}

export function handlePositionChanged(event: PositionChanged): void {
  let wallet = SmartWallet.load(event.params.trader.toHexString())
  if(wallet !== null) {
    wallet.tradeCount += BigInt.fromI32(1)
    wallet.tradeVolume += event.params.positionNotional
    wallet.save()
  }
}
