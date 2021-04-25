import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  OrderChanged,
  OrderCreated,
  OrderFilled,
  TrailingOrderCreated,
  TrailingOrderFilled,
  PokeContractCall
} from "../generated/Contract/Contract"
import { Order,
  TrailingOrder
} from "../generated/schema"

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
  entity.expiry = order.expiry
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
  entity.expiry = order.expiry
  entity.save()
}


export function handleOrderFilled(event: OrderFilled): void {
  let entity = Order.load(event.params.order_id.toString())
  entity.filled = true
  entity.stillValid = false
  entity.save()
}

export function handleTrailingOrderCreated(event: TrailingOrderCreated): void {
  let entity = new TrailingOrder(event.params.order_id.toString())
  let contract = Contract.bind(event.address)
  let order = contract.getTrailingData(event.params.order_id)
  entity.witnessPrice = order.witnessPrice.d
  entity.trail = order.trail.d
  entity.trailPct = order.trailPct.d
  entity.gap = order.gap.d
  entity.gapPct = order.gapPct.d
  entity.snapshotCreated = order.snapshotCreated
  entity.snapshotLastUpdated = order.snapshotLastUpdated
  entity.snapshotTimestamp = order.snapshotTimestamp
  entity.lastUpdatedKeeper = order.lastUpdatedKeeper
  entity.usePct = order.usePct
  entity.save()
}

export function handlePokeContract(call: PokeContractCall): void {
  let entity = TrailingOrder.load(call.inputs.order_id.toString())
  let contract = Contract.bind(call.to)
  let order = contract.getTrailingData(call.inputs.order_id)
  entity.witnessPrice = order.witnessPrice.d
  entity.trail = order.trail.d
  entity.trailPct = order.trailPct.d
  entity.gap = order.gap.d
  entity.gapPct = order.gapPct.d
  entity.snapshotCreated = order.snapshotCreated
  entity.snapshotLastUpdated = order.snapshotLastUpdated
  entity.snapshotTimestamp = order.snapshotTimestamp
  entity.lastUpdatedKeeper = order.lastUpdatedKeeper
  entity.usePct = order.usePct
  entity.save()
}

export function handleTrailingOrderFilled(event: TrailingOrderFilled): void {}
