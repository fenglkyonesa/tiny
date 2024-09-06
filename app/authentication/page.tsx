"use client";
import { Button, Divider, Input, Link, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Github, MoveLeft } from "lucide-react";
import Logo from "@/components/Logo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PencilLine } from "lucide-react";

export const runtime = "edge";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [stepper, setStepper] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false); // 添加一个加载状态
  const [value, setValue] = React.useState("");

  const validateEmail = (email: string) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setLoading(true); // 开始加载
    try {
      // 模拟异步操作，例如API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setValue("");
      setStepper(1);
      console.log(email); // 打印邮件地址
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // 结束加载
    }
  };
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null; // 明确interval的类型
    if (seconds > 0) {
      interval = setInterval(() => setSeconds(seconds - 1), 1000);
    }

    return () => {
      if (interval !== null) {
        // 检查interval是否为null
        clearInterval(interval); // 清理定时器
      }
    };
  }, [seconds]);

  const resendCode = async (email: string) => {
    setStepper(2);
    setSeconds(5);
    try {
      // 模拟异步操作，例如API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(email); // 打印邮件地址
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <main className="flex justify-center items-center w-full min-h-screen">
      <div className="w-96 h-[600px] flex flex-col gap-3">
        {stepper == 1 ? (
          <Link href="/" className="font-semibold gap-1" title="back">
            <Logo />
            LRU
          </Link>
        ) : (
          <div
            className="flex w-32 gap-1 cursor-pointer"
            onClick={() => setStepper(1)}
          >
            <MoveLeft />
            Back
          </div>
        )}

        <p className="text-center font-bold text-2xl">
          {stepper == 1
            ? "The world exists because of you"
            : "Verify the verification code"}
        </p>
        <p className="text-zinc-400 font-semibold">
          {stepper == 1
            ? "Enter your email below to Join Us"
            : "Enter the verification code you received"}
        </p>
        {stepper == 1 ? (
          <>
            <form>
              <Input
                isClearable
                type="email"
                radius="lg"
                size="sm"
                variant="bordered"
                label="Email"
                value={email}
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "primary"}
                errorMessage="Please enter a valid email"
                onValueChange={setEmail}
              />
              <Button
                className="w-full mt-2"
                color={loading || !email || isInvalid ? "default" : "primary"} // 动态设置颜色
                type="submit"
                isDisabled={loading || !email || isInvalid}
                onClick={() => resendCode(email)}
              >
                {loading ? <Spinner /> : "Sign In with Email"}
              </Button>
            </form>
            <div className="flex justify-center gap-2 items-center my-4">
              <Divider className="w-24" />
              <span>OR CONTINUE WITH</span>
              <Divider className="w-24" />
            </div>
            <Button
              color={loading ? "default" : "primary"} // 动态设置颜色
              type="button"
              isDisabled={loading}
              startContent={<Github />}
            >
              {loading ? <Spinner /> : "GitHub"}
            </Button>

            <p className="text-center mt-4">
              By clicking continue, you agree to our
              <Link href="#" underline="always">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" underline="always">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-full  gap-4 justify-center">
              <div className="flex gap-1">
                {email}
                <span
                  className="text-indigo-500 cursor-pointer"
                  onClick={() => setStepper(1)}
                >
                  <PencilLine size={20} />
                </span>
              </div>
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Link
                className="cursor-pointer"
                underline="always"
                isDisabled={seconds > 0}
                onClick={() => resendCode(email)}
              >
                <p>
                  Didn't receive a code? Resend
                  {seconds > 0 && <span>({seconds})</span>}
                </p>
              </Link>

              <Button
                color={!value || value.length !== 6 ? "default" : "primary"}
                type="submit"
                className="w-full m-3"
                isDisabled={!value || value.length !== 6}
                onClick={(e) => handleSubmit(e)}
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
