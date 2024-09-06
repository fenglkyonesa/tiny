"use client";
import { Button, Divider, Input, Link, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { Github } from "lucide-react";
import Logo from "@/components/Logo";
export const runtime = "edge";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 添加一个加载状态

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setLoading(true); // 开始加载
    try {
      // 模拟异步操作，例如API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEmail("");
      console.log(email); // 打印邮件地址
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // 结束加载
    }
  };

  return (
    <main className="flex justify-center items-center w-full min-h-screen">
      <div className="w-96 h-[600px] flex flex-col gap-3">
        <Link href="/">
          <Logo />
        </Link>

        <p className="text-center font-bold text-2xl">Create an account</p>
        <p className="text-zinc-400 font-semibold">
          Enter your email below to create your account
        </p>
        <form>
          <Input
            type="email"
            radius="lg"
            size="sm"
            variant="bordered"
            label="Email"
            value={email}
            onValueChange={setEmail}
          />
          <Button
            className="w-full mt-2"
            color={loading || !email ? "default" : "primary"} // 动态设置颜色
            type="submit"
            isDisabled={loading || !email}
            onClick={(e) => handleSubmit(e)}
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
      </div>
    </main>
  );
}
