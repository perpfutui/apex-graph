import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  OrderChanged,
  OrderCreated,
  OrderFilled,
  OwnershipTransferred,
  TrailingOrderCreated,
  TrailingOrderFilled
} from "../generated/Contract/Contract"
import { Order } from "../generated/schema"

export function handleOrderChanged(event: OrderChanged): void {
  let entity = Order.load(event.params.order_id.toString())
  let contract = Contract.bind(event.address)
  let order = contract.getLimitOrder(event.params.order_id)
  entity.reduceOnly = order.reduceOnly
  entity.stillValid = order.stillValid
  entity.stopPrice = order.stopPrice.d
  entity.limitPrice = order.limitPrice.d
  entity.orderSize = order.orderSize.d
  entity.collateral = order.collateral.d
  entity.leverage = order.leverage.d
  entity.slippage = order.slippage.d
  entity.save()
}

export function handleOrderCreated(event: OrderCreated): void {
  let entity = new Order(event.params.order_id.toString())
  let contract = Contract.bind(event.address)
  let order = contract.getLimitOrder(event.params.order_id)
  entity.id = event.params.order_id.toString()
  entity.trader = event.params.trader
  entity.reduceOnly = order.reduceOnly
  entity.stillValid = order.stillValid
  entity.orderType = BigInt.fromI32(order.orderType)
  entity.stopPrice = order.stopPrice.d
  entity.limitPrice = order.limitPrice.d
  entity.orderSize = order.orderSize.d
  entity.collateral = order.collateral.d
  entity.leverage = order.leverage.d
  entity.slippage = order.slippage.d
  entity.tipFee = order.tipFee.d
  entity.filled = false
  entity.asset = order.asset
  entity.save()
}


export function handleOrderFilled(event: OrderFilled): void {
  let entity = Order.load(event.params.order_id.toString())
  entity.filled = true
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTrailingOrderCreated(event: TrailingOrderCreated): void {}

export function handleTrailingOrderFilled(event: TrailingOrderFilled): void {}
