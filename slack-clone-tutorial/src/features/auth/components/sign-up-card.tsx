//登录卡片组件
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
interface SignUpCardProps {
  setState: (state: SignFlow) => void;
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  //使用convexAuth提供的的方法来注册或登录
  const { signIn } = useAuthActions();
  //第三方平台注册回调
  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  //使用convexAuth提供的方法来注册用户(邮箱密码),作为表单回调
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPasword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    //第一个参数是登录或注册的方式，第二个参数是表单数据，其中要设置flow字段来分辨‘注册’和‘登录’
    signIn("password", { email, password, flow: "signUp" })
      .catch(() => {
        setError("😱Something went wrong!");
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Input
            disabled={pending}
            value={confirmPasword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Confirm Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignUp("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
