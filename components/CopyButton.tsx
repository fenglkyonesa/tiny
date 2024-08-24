import React, { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CopyButton: React.FC<{ url: string }> = ({ url }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCopy = () => {
    if (isDisabled) return; // Prevent action if button is disabled

    setIsCopied(true); // Change to check icon
    setIsDisabled(true); // Disable the button

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Successfully toasted!");
        setTimeout(() => {
          setIsCopied(false); // Restore the original icon
          setIsDisabled(false); // Re-enable the button
        }, 2000); // Reset after 1 second
      })
      .catch((err) => {
        console.error("复制失败:", err);
        setIsCopied(false); // Restore the original icon on failure
        setIsDisabled(false); // Re-enable the button
      });
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div
        onClick={handleCopy}
        className="cursor-pointer  w-6 h-6"
        onMouseDown={(e) => e.preventDefault()} // Prevent default action on mouse down
      >
        {isCopied ? <CheckCircle className="text-green-500" /> : <Copy />}
      </div>
    </>
  );
};

export default CopyButton;
