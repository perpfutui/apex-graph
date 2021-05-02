import {
  Address
} from "@graphprotocol/graph-ts"
import {
  SmartWallet
} from "../generated/schema"

export function getSmartWalletOwner(smartWallet: Address): Address {
  let wallet = SmartWallet.load(smartWallet.toHexString())
  return Address.fromHexString(wallet.owner)
}
