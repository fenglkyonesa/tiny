// QRCodeGenerator.js
import { QRCodeSVG } from "qrcode.react";

// 定义错误校正级别类型
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// 接口定义，其中 src 为可选
interface QRCodeGeneratorOp {
  value: string;
  level: ErrorCorrectionLevel;
  marginSize?: number;
  src?: string; // 可选的 src 属性
  minVersion?: number; // 可选的 minVersion
}

const QRCodeGenerator = (parms: QRCodeGeneratorOp) => {
  return (
    <QRCodeSVG
      value={parms.value}
      size={128}
      level={parms.level}
      marginSize={parms.marginSize || 2}
      minVersion={parms.minVersion || 5} // 默认值为 5
      imageSettings={{
        src: parms.src || "https://static.zpao.com/favicon.png", // 如果未提供 src，使用默认图片
        height: 30,
        width: 30,
        opacity: 1,
        excavate: true, // 允许在二维码图像中挖掘出图标位置
      }}
    />
  );
};

export default QRCodeGenerator;
