import { OrderStatus } from "@csktickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;

  findByIdAndPreviousVersion(event: {
    id: string;
    version: number;
  }): Promise<OrderDoc> | null;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByIdAndPreviousVersion = (event: {
  id: string;
  version: number;
}) => {
  return Order.findOne({
    _id: event.id,
    __v: event.version - 1,
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    __v: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, orderSchema };
