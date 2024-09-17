import React from "react";
import { TelegramContext } from "../providers";

export const useTelegram = () => React.useContext(TelegramContext);
