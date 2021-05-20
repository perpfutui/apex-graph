import {
  BigInt,
  Address
} from "@graphprotocol/graph-ts"
import {
  SmartWallet,
  AmmPosition
} from "../generated/schema"

export function getSmartWalletOwner(smartWallet: Address): Address {
  let wallet = SmartWallet.load(smartWallet.toHexString())
  return Address.fromHexString(wallet.owner)
}

export function getAmmPosition(amm: Address, trader: Address): AmmPosition {
  let ammPosition = AmmPosition.load(parseAmmPositionId(amm, trader))
  if (!ammPosition) {
    ammPosition = createAmmPosition(amm, trader)
  }
  return ammPosition!
}

export function createAmmPosition(amm: Address, trader: Address): AmmPosition {
  let ammPositionId = parseAmmPositionId(amm, trader)
  let ammPosition = new AmmPosition(ammPositionId)
  ammPosition.amm = amm
  ammPosition.trader = trader
  ammPosition.position = parsePositionId(trader)
  ammPosition.positionSize = BigInt.fromI32(0)
  ammPosition.save()
  return ammPosition
}

export function parseAmmPositionId(amm: Address, trader: Address): string {
  return amm.toHexString() + "-" + trader.toHexString()
}

export function parsePositionId(trader: Address): string {
  return trader.toHexString()
}
