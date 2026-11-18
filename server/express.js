import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/project.routes.js";
import qualificationRoutes from "./routes/qualification.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://assignment-2-xi-lake.vercel.app",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS request origin:", origin);

      if (!origin) {
        return callback(null, true);
      }

      try {
        const hostname = new URL(origin).hostname;

        const isAllowed =
          allowedOrigins.includes(origin) ||
          (hostname.startsWith("assignment-2-") &&
            hostname.endsWith(".vercel.app"));

        if (isAllowed) {
          return callback(null, true);
        }

        console.log("Blocked CORS origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      } catch (error) {
        return callback(new Error("Invalid CORS origin"));
      }
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());

// Application routes
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", contactRoutes);
app.use("/", projectRoutes);
app.use("/", qualificationRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: err.name + ": " + err.message,
    });
  }

  if (err) {
    console.log(err);

    return res.status(400).json({
      error: err.name + ": " + err.message,
    });
  }

  next();
});

export default app;