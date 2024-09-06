import { QRCodeSVG } from "qrcode.react";
import React from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface QRcodeCardOp {
  shortUrl: string;
  ref: any;
}
export default function QRcodeCard(param: QRcodeCardOp) {
  return (
    <div className="flex items-center justify-center">
      <QRCodeSVG
        value={`${apiBaseUrl}/${param.shortUrl}?qr=1`}
        size={128}
        level={"L"}
        marginSize={2}
        ref={param.ref}
        minVersion={5} // 默认值为 5
        imageSettings={{
          src: "https://static.zpao.com/favicon.png", // 如果未提供 src，使用默认图片
          height: 30,
          width: 30,
          opacity: 1,
          excavate: true,
        }}
      />
    </div>
  );
}
