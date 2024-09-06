import React from "react";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { ScanQrCode } from "lucide-react";
import { Globe } from "lucide-react";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";
export default function IndexTabs() {
  return (
    <Accordion
      className="w-[95%] mb-10 md:w-[700px] font-semibold"
      defaultExpandedKeys={["1"]}
      variant="bordered"
      isCompact
    >
      <AccordionItem
        key="1"
        aria-label="Analytics that matter"
        startContent={<ChartNoAxesColumnIncreasing />}
        title="Analytics that matter"
      >
        <div className="space-y-5">
          <p>
            Lur.me provides powerful analytics for your links, including
            geolocation, device, browser, and referrer information.
          </p>
          <Button
            variant="shadow"
            radius="full"
            color="primary"
            className="font-bold"
          >
            Learn more
          </Button>
        </div>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Use your own domain"
        startContent={<Globe />}
        title="Use your own domain"
      >
        <div className="space-y-5">
          <p>
            Dub.co offers free custom domains on all plans for you to create
            branded links that stand out.
          </p>
          <Button
            variant="shadow"
            radius="full"
            color="primary"
            className="font-bold"
          >
            Learn more
          </Button>
        </div>
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Free QR Code Generator"
        startContent={<ScanQrCode />}
        title="Free QR Code Generator"
      >
        <div className="space-y-5">
          <p>
            QR codes and short links are like peas in a pod. Dub.co offers free
            QR codes for every short link you create.
          </p>
          <Button
            variant="shadow"
            radius="full"
            color="primary"
            className="font-bold"
          >
            Learn more
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
