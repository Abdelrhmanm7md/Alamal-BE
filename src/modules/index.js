import AppError from "../utils/appError.js";
import chatRouter from "./Chat/chat.routes.js";
import companyRouter from "./Company/company.routes.js";
import notiticationRouter from "./Notification/notification.routes.js";
import paymentRouter from "./Payments/payment.routes.js";
import productRouter from "./Product/product.routes.js";
import transRouter from "./Trans/trans.routes.js";
import visitRouter from "./Visits/visits.routes.js";
import authRouter from "./auth/auth.routes.js";
import invoiceRouter from "./invoices/invoice.routes.js";
import messageRouter from "./Message/message.routes.js";
import usersRouter from "./users/users.routes.js";
import returnInvoiceRouter from "./Return Invoice/returnInvoice.routes.js";

export function init(app) {
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);
  app.use("/invoice", invoiceRouter);
  app.use("/payment", paymentRouter);
  app.use("/notification", notiticationRouter);
  app.use("/trans", transRouter);
  app.use("/visit", visitRouter);
  app.use("/product", productRouter);
  app.use("/company", companyRouter);
  app.use("/chat", chatRouter);
  app.use("/message", messageRouter);
  app.use("/returnInvoice", returnInvoiceRouter);

  app.use("/", (req, res, next) => {
    res.send("Page Not Found");
  });

  app.all("*", (req, res, next) => {
    next(new AppError(`Not Found `, 404));
  });

  // app.use((err, req, res, next) => {
  //   res
  //     .status(err.statusCode)
  //     .json({ message: err.message, statusCode: err.statusCode });
  // });
}
