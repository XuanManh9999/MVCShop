const mongoose = require("../../common/database")();

const warrantySchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Orders",
    },
    item_index: {
      type: Number,
      required: true, // Vị trí item trong mảng items của order
    },
    prd_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    prd_name: {
      type: String,
      required: true,
    },
    serial_number: {
      type: String,
      required: true,
      unique: true, // QR code unique
    },
    qr_code: {
      type: String,
      required: true,
      unique: true,
    },
    purchase_date: {
      type: Date,
      required: true,
    },
    warranty_period: {
      type: Number,
      required: true, // Số tháng bảo hành
    },
    warranty_end_date: {
      type: Date,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const warrantyModel = mongoose.model(
  "Warranties",
  warrantySchema,
  "warranties"
);
module.exports = warrantyModel;
