import AppError from "../utils/appError.js";
import notiticationRouter from "./Notification/notification.routes.js";
import paymentRouter from "./Payments/payment.routes.js";
import productRouter from "./Product/product.routes.js";
import transRouter from "./Trans/trans.routes.js";
import visitRouter from "./Visits/visits.routes.js";
import authRouter from "./auth/auth.routes.js";
import invoiceRouter from "./invoices/invoice.routes.js";
import usersRouter from "./users/users.routes.js";

export function init(app) {
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);
  app.use("/invoice", invoiceRouter);
  app.use("/payment", paymentRouter);
  app.use("/notification", notiticationRouter);
  app.use("/trans", transRouter);
  app.use("/visit", visitRouter);
  app.use("/product", productRouter);

  app.use("/", (req, res, next) => {
    res.send("hello world");
  });

  app.all("*", (req, res, next) => {
    next(new AppError(`not found `, 404));
  });

  app.use((err, req, res, next) => {
    res
      .status(err.statusCode)
      .json({ message: err.message, statusCode: err.statusCode });
  });
}
