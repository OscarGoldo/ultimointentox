"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { CAL_LINK, CAL_NAMESPACE, CAL_UI_CONFIG } from "@/lib/booking";

export function useCalBooking() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", CAL_UI_CONFIG);
    })();
  }, []);

  const openModal = async () => {
    const cal = await getCalApi({ namespace: CAL_NAMESPACE });
    cal("modal", { calLink: CAL_LINK, config: { layout: CAL_UI_CONFIG.layout } });
  };

  return { openModal };
}
