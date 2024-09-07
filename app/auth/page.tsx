"use client";
import { Button, Divider, Input, Link, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Github, MoveLeft, PencilLine } from "lucide-react";
import Logo from "@/components/Logo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const runtime = "edge";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [stepper, setStepper] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false); // 添加一个加载状态
  const [value, setValue] = React.useState<string>("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const validateEmail = (email: string) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);
  const router = useRouter(); // 创建路由对象
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setLoading(true); // 开始加载
    const data = {
      email,
      code: value,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json(); // 将响应体转换为JSON
      localStorage.setItem("token", result.token); // 保存token到本地存储
      router.push("/dash"); // 跳转到Dashboard页面
    } catch (error) {
      setValue("");
      toast.error("Failed to verify the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null; // 明确interval的类型
    if (seconds > 0) {
      interval = setInterval(() => setSeconds(seconds - 1), 1000);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval); // 清理定时器
      }
    };
  }, [seconds]);

  const resendCode = async (email: string) => {
    setValue("");
    setStepper(2);
    setSeconds(60);
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/auth/sendCode?email=${email}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      toast.success("Verification code sent successfully!");
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  return (
    <main className="flex justify-center items-center w-full min-h-screen px-4">
      <div className="w-96 h-[600px] flex flex-col gap-3">
        {stepper === 1 ? (
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
          {stepper === 1
            ? "The world exists because of you"
            : "Verify the verification code"}
        </p>
        <p className="text-zinc-400 font-semibold">
          {stepper === 1
            ? "Enter your email below to Join Us"
            : "Enter the verification code you received"}
        </p>
        {stepper === 1 ? (
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
                color={loading || !email || isInvalid ? "default" : "primary"}
                type="submit"
                isDisabled={loading || !email || isInvalid}
                onClick={() => resendCode(email)}
              >
                {loading ? <Spinner /> : "Send Verification Code"}
              </Button>
            </form>
            <div className="flex justify-center gap-2 items-center my-4">
              <Divider className="w-24" />
              <span className="text-sm md:font-semibold">OR CONTINUE WITH</span>
              <Divider className="w-24" />
            </div>
            <Button
              color={loading ? "default" : "primary"}
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
            <div className="flex flex-col items-center w-full gap-4 justify-center">
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
                onChange={(val) => setValue(val)}
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
