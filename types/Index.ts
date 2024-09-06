interface IndexCardItemProps {
  shortUrl: string;
  longUrl: string;
  clicks: number;
}
interface DataItem {
  [key: string]: any; // Allows any property
}
interface QRCodeGeneratorOp {
  img: string;
  size?: number; // 二维码的尺寸
  bgColor?: string; // 背景色
  fgColor?: string; // 前景色
}

interface IndexCardItemProps {
  shortUrl: string;
  longUrl: string;
  clicks: number;
  onDelete: (shortUrl: string) => void;
}
