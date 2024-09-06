import React, { useCallback, useRef, useState } from "react";
import numeral from "numeral";
import { motion } from "framer-motion";
import { CornerDownRight, QrCode } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Slider,
  Switch,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import CopyButton from "./CopyButton";
import ECGAnimation from "./ECGAnimation";
import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { ImageDown } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Key } from "@react-types/shared";
import { Sparkles } from "lucide-react";
import { HexColorPicker } from "react-colorful"; // Import the color picker

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatValue = (value: number) => numeral(value).format("0.a");

const IndexCardItem: React.FC<IndexCardItemProps> = React.memo(
  ({ shortUrl, longUrl, clicks, onDelete }) => {
    const handleDragEnd = useCallback(
      (_event: any, info: { offset: { x: number } }) => {
        if (info.offset.x < -100) {
          onDelete(shortUrl);
        }
      },
      [shortUrl, onDelete]
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const qrCodeRef = useRef<HTMLCanvasElement>(null);
    const downloadQRCode = (format: Key) => {
      const canvas = qrCodeRef.current;
      if (!canvas) return;

      try {
        const formatMap = {
          PNG: { mimeType: "image/png", extension: "png" },
          JPEG: { mimeType: "image/jpeg", extension: "jpeg" },
          JPG: { mimeType: "image/jpg", extension: "jpg" },
          SVG: { mimeType: "image/svg+xml", extension: "svg" },
        } as const;

        const { mimeType, extension } =
          formatMap[format as keyof typeof formatMap];

        const imgUrl = canvas
          .toDataURL(mimeType)
          .replace(mimeType, "image/octet-stream");

        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `${shortUrl}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("下载 QR 码失败:", error);
      }
    };
    const [showLogo, setShowLogo] = useState<boolean>(true);
    const [qrcodeOptions, setQrcodeOptions] = useState<QRCodeGeneratorOp>({
      img: showLogo ? "/image.png" : "",
      size: 156,
      bgColor: "#ffffff",
      fgColor: "#000000",
    });

    const handleSwitchChange = (isChecked: boolean) => {
      setShowLogo(isChecked);
      setQrcodeOptions((prevOptions) => ({
        ...prevOptions,
        img: isChecked ? "/image.png" : "",
      }));
    };

    const handleSizeChange = (value: number) => {
      setQrcodeOptions((prevOptions) => ({
        ...prevOptions,
        size: value,
      }));
    };

    // Handle foreground color change
    const handleColorChange = (color: string) => {
      setQrcodeOptions((prevOptions) => ({
        ...prevOptions,
        fgColor: color,
      }));
    };

    return (
      <motion.div
        key={shortUrl}
        className="px-4 shadow-lg cursor-pointer w-full h-16 flex items-center  justify-between border-[1px] border-zinc-700 rounded-2xl"
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex gap-8 items-center">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={`${longUrl}/favicon.ico`}
          />
          <div className="flex flex-col">
            <div className="flex flex-row gap-4 items-center">
              <Link
                href={`${apiBaseUrl}/${shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-bold text-foreground hover:underline"
              >
                {"lru.me/" + shortUrl}
              </Link>
              <CopyButton url={`${apiBaseUrl}/${shortUrl}`} />
              <Button
                onPress={onOpen}
                isIconOnly
                startContent={<QrCode />}
                className="bg-opacity-0"
              />

              <Modal
                isOpen={isOpen}
                backdrop={"blur"}
                onOpenChange={onOpenChange}
                placement="top-center"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col items-center">
                        Build QRcode
                      </ModalHeader>
                      <ModalBody className="p-10 border-t">
                        <div className="qrcode-container flex items-center justify-center">
                          <QRCodeCanvas
                            value={`${apiBaseUrl}/${shortUrl}?qr=1`}
                            size={qrcodeOptions.size}
                            marginSize={1}
                            bgColor={qrcodeOptions.bgColor}
                            fgColor={qrcodeOptions.fgColor}
                            level={"H"}
                            ref={qrCodeRef}
                            imageSettings={{
                              src: qrcodeOptions.img,
                              height: 35,
                              width: 35,
                              opacity: 1,
                              excavate: true,
                              crossOrigin: "anonymous",
                            }}
                          />
                        </div>
                        <Accordion>
                          <AccordionItem
                            key="1"
                            startContent={<Sparkles />}
                            aria-label="Accordion 1"
                            title="Magic"
                          >
                            <Switch
                              defaultSelected={showLogo}
                              color="success"
                              onChange={(e) =>
                                handleSwitchChange(e.target.checked)
                              }
                            >
                              Show Logo
                            </Switch>
                            <Slider
                              size="md"
                              step={5}
                              color="foreground"
                              label="设置大小"
                              showSteps={true}
                              maxValue={256}
                              minValue={156}
                              defaultValue={156}
                              className="mt-3"
                              onChange={(value) =>
                                handleSizeChange(value as number)
                              }
                            />
                            <Accordion>
                              <AccordionItem
                                key="2"
                                aria-label="Accordion 2"
                                title="Foreground Color:"
                              >
                                <HexColorPicker
                                  color={qrcodeOptions.fgColor}
                                  onChange={handleColorChange}
                                />
                              </AccordionItem>
                            </Accordion>
                          </AccordionItem>
                        </Accordion>
                        <Dropdown showArrow>
                          <DropdownTrigger>
                            <Button
                              startContent={<ArrowDownToLine />}
                              color="primary"
                            >
                              Export
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Static Actions"
                            onAction={(key) => downloadQRCode(key)}
                          >
                            <DropdownItem
                              startContent={<ImageDown />}
                              key="PNG"
                            >
                              PNG
                            </DropdownItem>
                            <DropdownItem
                              startContent={<ImageDown />}
                              key="JPEG"
                            >
                              JPEG
                            </DropdownItem>
                            <DropdownItem
                              startContent={<ImageDown />}
                              key="JPG"
                            >
                              JPG
                            </DropdownItem>
                            <DropdownItem
                              startContent={<ImageDown />}
                              key="SVG"
                            >
                              SVG
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Tooltip content={`clicks: ${clicks}`}>
                <div className="hidden md:flex gap-2">
                  <ECGAnimation color="#fff" />
                  <p>{formatValue(clicks)}</p>
                </div>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              <CornerDownRight size={16} />
              <Link
                href={longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground text-sm font-medium hover:underline"
              >
                {longUrl}
              </Link>
            </div>
          </div>
          <Link
            href={`/analysis/${shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip content={`clicks: ${clicks}`} className="flex md:hidden">
              <Button color="primary" radius="full" size="sm" variant={"solid"}>
                <p className="hidden md:block font-sans font-bold">view</p>
                <div className="flex md:hidden items-center justify-center gap-2">
                  <ECGAnimation color="#000" />
                  <p>{formatValue(clicks)}</p>
                </div>
              </Button>
            </Tooltip>
          </Link>
        </div>
      </motion.div>
    );
  }
);

export default IndexCardItem;
