import {
  BigInt
} from "@graphprotocol/graph-ts"
import {
  LimitOrderBook,
  OrderChanged,
  OrderCreated,
  OrderFilled,
  OrderCancelled,
  TrailingOrderCreated,
  TrailingOrderFilled,
  TrailingOrderChanged,
  TrailingOrderCancelled,
  ContractPoked
} from "../generated/LimitOrderBook/LimitOrderBook"
import {
  Order,
  TrailingOrder,
  Trade
} from "../generated/schema"

export function handleOrderCreated(event: OrderCreated): void {
  let entity = new Order(event.params.order_id.toString())
  let contract = LimitOrderBook.bind(event.address)
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
  let trade = Trade.load(event.transaction.hash.toHex())
  if(trade == null) {
    trade = new Trade(event.transaction.hash.toHex())
  }
  trade.order_id = event.params.order_id
  trade.order = event.params.order_id.toString()
  trade.save()
}

export function handleOrderChanged(event: OrderChanged): void {
  let entity = Order.load(event.params.order_id.toString())
  let contract = LimitOrderBook.bind(event.address)
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

export function handleOrderCancelled(event: OrderCancelled): void {
  let entity = Order.load(event.params.order_id.toString())
  entity.stillValid = false
  entity.save()
}

export function handleTrailingOrderCreated(event: TrailingOrderCreated): void {
  let entity = new TrailingOrder(event.params.order_id.toString())
  let contract = LimitOrderBook.bind(event.address)
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

  let orderData = Order.load(event.params.order_id.toString())
  orderData.trailingData = event.params.order_id.toString()
  orderData.save()
}

export function handleTrailingOrderFilled(event: TrailingOrderFilled): void {
}

export function handleTrailingOrderChanged(event: TrailingOrderChanged): void {
  let trailingEntity = TrailingOrder.load(event.params.order_id.toString())
  let contract = LimitOrderBook.bind(event.address)
  let to = contract.getTrailingData(event.params.order_id)
  trailingEntity.witnessPrice = to.witnessPrice.d
  trailingEntity.trail = to.trail.d
  trailingEntity.trailPct = to.trailPct.d
  trailingEntity.gap = to.gap.d
  trailingEntity.gapPct = to.gapPct.d
  trailingEntity.snapshotLastUpdated = to.snapshotLastUpdated
  trailingEntity.snapshotTimestamp = to.snapshotTimestamp
  trailingEntity.lastUpdatedKeeper = to.lastUpdatedKeeper
  trailingEntity.usePct = to.usePct
  trailingEntity.save()
}

export function handleTrailingOrderCancelled(event: TrailingOrderCancelled): void {

}


export function handleContractPoked(event: ContractPoked): void {
  let entity = TrailingOrder.load(event.params.order_id.toString())
  let contract = LimitOrderBook.bind(event.address)
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

  let ent = Order.load(event.params.order_id.toString())
  let ord = contract.getLimitOrder(event.params.order_id)
  ent.stopPrice = ord.stopPrice.d
  ent.limitPrice = ord.limitPrice.d
  ent.save()
}
